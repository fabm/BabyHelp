/// <reference path="ext/gapi/gapi.d.ts" />
/// <reference path="lib.ts" />

interface AuthResponse {
    logged:()=>void;
    notlogged:()=>void;
}

interface Resolve {
    success:(response)=>void;
    error:(response)=>void;
    unauthorized?:(response)=>void;
}

interface Executor {
    execute:(resolver:Resolve)=>void;
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
    public api:{[index:string]:any};
    private config = {};
    public defaultResolver:Resolve = {
        success: function (success) {
            console.log(success);
        },
        error: function (error) {
            console.log(error);
        },
        unauthorized: function (unauthorized) {
            console.log(unauthorized);
        }
    }


    public static logout() {
        gapi.auth.setToken(null);
        this.logged = false;
    }

    public login(callback:()=>void) {
        this.checkAuth(false, callback);
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
            this.config['approval_prompt'] = 'force';
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

    loadApi(callback?:()=>void) {
        var self = this;

        function callAttributes() {
            self.api = {};
            self.attribClient(gapi.client[self.client], self.api);
            self.callCBState(StateLoading.callService);
            if (!isNull(callback))callback();
        }

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
                callAttributes();
            }, self.apiUrl);
        } else if (isNull(self.api)) {
            callAttributes()
        } else {
            if (!isNull(callback))callback();
        }
    }

    afterLoad = function () {
        console.log('loaded ' + this.client);
    }

    private attribClient(client, context) {
        var obSelf = this;
        for (var m in client) {
            if (typeof (client[m]) === 'function')
                context[m] = {
                    args: undefined,
                    mName: m,
                    argsEval: function () {
                        var self = this;
                        client[this.mName]({'eval': true}).execute((response)=> {
                            var result = response.result;
                            self.args = {};
                            self['validations'] = {};
                            self['alias'] = {};
                            for (var r in result) {
                                var type = result[r]['type'];
                                var validations = result[r]['validations'];
                                var al = result[r]['alias'];
                                if (!isNull(validations))
                                    self['validations'][r] = validations;
                                if (!isNull(al))
                                    self['alias'][r] = al;
                                if (type === 'String') {
                                    self.args[r] = '';
                                } else if (type === 'List') {
                                    self.args[r] = [];
                                } else if (type === 'boolean') {
                                    self.args[r] = true;
                                }
                            }
                            self.response = response.result;
                        });
                    },
                    execute: function (resolver?:Resolve) {
                        var self = this;
                        if (isNull(resolver))
                            resolver = obSelf.defaultResolver;

                        function getValidation(name, value) {
                            var valArr = self['validations'][name];
                            if (!isNull(valArr))
                                for (var val in valArr) {
                                    if (!obSelf['validations'][valArr[val]].check(value)) {
                                        var al = self['alias'][name];
                                        al = (al == undefined) ? name : al;
                                        resolver.error(
                                            {error: {
                                                message: obSelf['validations'][valArr[val]].alert(al)
                                            }}
                                        );
                                        return;
                                    }
                                }
                        }


                        if (!isNull(self.args) && !isNull(self['validations']))
                            for (var p in self.validations) {
                                var ret = getValidation(p, self.args[p]);
                            }


                        client[this.mName](self.args).execute((response)=> {
                            if (isNull(response.code)) {
                                resolver.success(response);
                            } else if (response.code == 401) {
                                resolver.unauthorized(response.error.message);
                            } else {
                                resolver.error(response.error);
                            }
                        });
                    }
                }
            else {
                context[m] = {};
                obSelf.attribClient(client[m], context[m]);
            }
        }
    }


    helpLoader(name) {
        this.client = name;
        this.loadApi();
    }
}

class ClientBabyHelp extends ClientLoader {
    constructor() {
        super();
        this.apiUrl = 'http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api";
        super.setClientID('942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com');
        super.setScope(['https://www.googleapis.com/auth/userinfo.email']);
    }

    validations = {
        EMAIL: {
            check(value) {
                return /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(value);
            },
            alert(alias) {
                return "O campo " + alias + " não é reconhecido como email";
            }
        },
        REQUIRED: {
            check(value) {
                if (isNull(value))return false;
                if (value.length == 0) return false;
                return true;
            },
            alert(alias) {
                return "O campo " + alias + " não pode ser vazio";
            }
        }
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
        all.push(create('educador', 'PARENT'));
        return all;
    }


    getRoles(user):Executor {
        var self = this;

        var onSuccess;

        var iResolver = {
            success: (response)=> {
                var allRoles:Array<Role> = UserService.loadAllRoles();
                allRoles.forEach((value, index, arr)=> {
                    value.role = response.body.indexOf(value.name) != -1;
                });
                user.roles = allRoles;
                onSuccess(null);
            },
            error: null,
            unauthorized: null
        };


        return {
            execute: (resolver:Resolve)=> {
                iResolver.error = resolver.error;
                iResolver.unauthorized = resolver.unauthorized;
                onSuccess = resolver.success;
                super.loadApi(()=> {
                    self.api['getRoles']({email: user.email}).execute(iResolver);
                });
            }
        };
    }

    updateRoles(user:{email:string;roles:Array<Role>}):Executor {
        var self = this;

        return {
            execute: (resolver:Resolve)=> {
                var rolesSelected:Array<string> = [];
                user.roles.forEach((value, index, arr)=> {
                    if (value.role)rolesSelected.push(value.name);
                });
                var updateRoles = self.api['updateRoles'];
                updateRoles.args = {'email': user.email, 'roles': rolesSelected};
                updateRoles.execute(resolver);
            }
        }
    }

    list():Executor {
        return this.api['list'];
    }
}

interface ArticleCreation {
    body:string;
    summary:string;
    title:string;
    photoUrl:string;
    isPublic:boolean;
}

interface ArticleUpdate extends ArticleCreation {
    id:number;
}

class ArticlesService extends ClientBabyHelp {
    constructor() {
        super();
        this.client = 'article';
    }

    get(id):Executor {
        return this.api['get']({id: id});
    }

    create(article:ArticleCreation):Executor {
        return this.api['create']({article: article});
    }

    listMy():Executor {
        return this.api['list']['my']();
    }

    listPublic():Executor {
        return this.api['list']['public']();
    }

    update(article:ArticleUpdate):Executor {
        return this.api['update'](article);
    }

    delete(ids):Executor {
        return this.api['delete']({ids: ids});
    }
}

class PhotoTokenService extends ClientBabyHelp {
    constructor() {
        super();
        this.client = 'photoToken';
    }

    getPhotoToken() {
        return this.api['getuploadurl']();
    }
}
