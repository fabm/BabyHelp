/// <reference path="ext/gapi/gapi.d.ts" />
/// <reference path="lib.ts" />

interface AuthResponse {
    logged:()=>void;
    notlogged:()=>void;
}

interface Resolve {
    then:(success:(response)=>void, error:(response)=>void, unauthorized?:(response)=>void)
        =>void
}

var auth = {
    _getConfig(immediate:boolean) {
        var config = {
            client_id: '942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com',
            scope: ['https://www.googleapis.com/auth/userinfo.email'],
            immediate: immediate
        };

        if (!immediate) {
            config['authuser'] = "";
        }
        return config;
    },
    login: (callbacks:AuthResponse, immediate?:boolean)=> {
        if (isNull(immediate))immediate = false;

        var config = isNull(config) ? auth._getConfig(immediate) : config;

        gapi.auth.authorize(config,
            (response)=> {
                if (!isNull(response) && isNull(response.error)) {
                    auth.islogged = true;
                    callbacks.logged();
                } else {
                    auth.islogged = false;
                    callbacks.notlogged();
                }
            });
    },
    checkauth: (callbacks:AuthResponse)=> {
        if (auth.islogged) {
            callbacks.logged();
        } else {
            auth._getConfig(true);
            auth.login(callbacks, true);
        }
    },
    islogged: false,
    load: (callbacks:AuthResponse)=> {
        var authLoad = ()=> {
            auth.checkauth(callbacks);
        }
        gapi.load('auth', authLoad);
    }, logout() {
        gapi.auth.setToken(null);
        this.islogged = false;
    }
}

enum StateLoading{
    loadingGAPI , authenticating, clientLoading, callService, authFail
}

class ClientLoader {
    public static logged:boolean = false;
    public apiUrl;
    public client:string;
    public version:string = 'v1';
    public requireAuth:boolean;
    public cbState:(state:StateLoading)=>void;
    private config = {};

    public static logout(){
        gapi.auth.setToken(null);
    }

    public login(callback:()=>void){
        this.checkAuth(false,callback);
    }

    setClientID(clientID:string) {
        this.config['client_id'] = clientID;
    }

    setScope(scope:Array<string>) {
        this.config['scope'] = scope;
    }

    private getAuthConfig = (immediate:boolean)=> {
        this.config['immediate'] = immediate;

        if (!immediate) {
            this.config['authuser'] = "";
        }
        return this.config;
    }

    private checkAuth(immediate:boolean, callback:()=>void) {
        var self = this;
        gapi.auth.authorize(self.getAuthConfig(immediate), (response)=> {
            if (response.error) {
                ClientLoader.logged = false
            } else {
                ClientLoader.logged = true;
            }
            callback();
        });
    }

    private callCBState(state:StateLoading) {
        if (this.cbState != null)
            this.cbState(state);
    }

    loadApi(callback:(client)=>void) {
        var self = this;
        if (isNull(gapi.auth)) {
            self.callCBState(StateLoading.loadingGAPI);
            gapi.load('auth', ()=> {
                self.callCBState(StateLoading.authenticating);
                self.loadApi(callback);
            });
        } else if (self.requireAuth && !ClientLoader.logged)
            self.checkAuth(true, ()=> {
                if (ClientLoader.logged) {
                    self.callCBState(StateLoading.clientLoading);
                    self.loadApi(callback);
                }
                else {
                    self.callCBState(StateLoading.authFail);
                }
            });
        else if (isNull(gapi.client[self.client])) {
            gapi.client.load(self.client, self.version, ()=> {
                self.callCBState(StateLoading.callService);
                callback(gapi.client[self.client]);
            }, self.apiUrl);
        }
    }

    load(callback:(client)=>void):Resolve {
        var self = this;
        var onSuccess:(response)=>void;
        var onError:(response)=>void;
        var onNotAuthorized:(response)=>void;
        var apiResponse = null;


        function resolve() {
            if (isNull(onSuccess))
                return;
            if (isNull(onError))
                return;
            if (apiResponse == null)
                return;
            if (isNull(apiResponse.error))
                onSuccess(apiResponse);
            else {
                if (!isNull(onNotAuthorized) && apiResponse.error.code == 401)
                    onNotAuthorized(apiResponse);
                else
                    onError(apiResponse);
            }
            apiResponse = null;
        }

        function execute(apiClient) {
            apiClient.execute((response)=> {
                apiResponse = response;
                resolve();
            });
        }

        if (isNull(gapi.auth)) {
            self.callCBState(StateLoading.loadingGAPI);
            gapi.load('auth', ()=> {
                self.callCBState(StateLoading.authenticating);
                self.load(callback);
            });
        } else if (self.requireAuth && !ClientLoader.logged)
            self.checkAuth(true, ()=> {
                if (ClientLoader.logged) {
                    self.callCBState(StateLoading.clientLoading);
                    self.load(callback);
                }
                else {
                    self.callCBState(StateLoading.authFail);
                }
            });
        else if (isNull(gapi.client[self.client])) {
            gapi.client.load(self.client, self.version, ()=> {
                self.callCBState(StateLoading.callService);
                execute(callback(gapi.client[self.client]));
            }, self.apiUrl);
        } else {
            self.callCBState(StateLoading.callService);
            execute(callback(gapi.client[self.client]));
        }

        return {
            then: (cbOnSuccess:(response)=>void, cbOnError:(response)=>void, cbOnNotAuthorized?:(response)=>void)=> {
                onSuccess = cbOnSuccess;
                onError = cbOnError;
                onNotAuthorized = cbOnNotAuthorized;
                resolve();
            }
        }
    }

}

class ClientBabyHelp extends ClientLoader {
    constructor() {
        super();
        this.apiUrl = 'http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api";
        super.setClientID('942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com');
        super.setScope(['https://www.googleapis.com/auth/userinfo.email']);
    }
}

interface Role {
    name:string;alias:string;role:boolean;
}

class UserService extends ClientBabyHelp {
    constructor() {
        super();
        this.client = 'userBH';
    }

    public static loadAllRoles():Array<Role> {
        function create(alias, name):Role {
            return {
                name: name,
                alias: alias,
                role: false
            };
        }

        var all:Array<Role> = [];
        all.push(create('técnico de saúde', 'HEALTHTEC'));
        all.push(create('administrador', 'ADMINISTRATOR'));
        return all;
    }

    list():Resolve {
        var self = this;
        return super.load((client)=> {
            return client.list();
        });
    }

    getRoles(user):Resolve {
        var loader = super.load((client)=> {
            return client.getRoles({email: user.email});
        });

        function then(onSuccess:(response)=>void, onError, onUnauthorized) {
            return loader.then((response)=> {
                var allRoles:Array<Role> = UserService.loadAllRoles();
                allRoles.forEach((value, index, arr)=> {
                    value.role = response.body.indexOf(value.name) != -1;
                });
                user.roles = allRoles;
                onSuccess(null);
            }, onError, onUnauthorized);
        }

        return {
            then: then
        };
    }

    updateRoles(user:{email:string;roles:Array<Role>}):Resolve {
        return super.load((client)=> {
            {
                var rolesSelected:Array<string> = [];
                user.roles.forEach((value, index, arr)=> {
                    if (value.role)rolesSelected.push(value.name);
                });

                return client.updateRoles({'email': user.email, 'roles': rolesSelected});
            }
        });
    }
}


interface ArticleCreation {
    body:string;
    summary:string;
    tittle:string;
    photoUrl:string;
}

interface ArticleUpdate extends ArticleCreation{
    id:number;
}

class ArticlesService extends ClientBabyHelp {
    constructor() {
        super();
        this.client = 'article';
    }

    create(article:ArticleCreation):Resolve {
        return super.load((client)=> {
            {
                return client.create(article);
            }
        });
    }
    listMy(){
        return super.load((client)=>{
            return client.list.my();
        });
    }
    update(article:ArticleUpdate){
        return super.load((client)=>{
            return client.update(article);
        });
    }
    delete(ids){
        return super.load((client)=>{
            return client.delete({ids:ids});
        });
    }
}

