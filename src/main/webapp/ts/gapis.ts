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
                var loadedClient = gapi.client[self.client];
                if (isNull(loadedClient)) {
                    Log.prtError("Houve um problema a carregar o serviço " + self.client + " por favor contacte o administrador");
                }
                self.callCBState(StateLoading.callService);
                execute(callback(gapi.client[self.client]));
            }, self.apiUrl);
        } else {
            self.callCBState(StateLoading.callService);
            execute(callback(gapi.client[self.client]));
        }

        return {
            then: (cbOnSuccess:(success)=>void, cbOnError:(error)=>void, cbOnNotAuthorized?:(notAuthorized)=>void)=> {
                onSuccess = cbOnSuccess;
                onError = cbOnError;
                onNotAuthorized = cbOnNotAuthorized;
                resolve();
            }
        }
    }

    afterLoad = function (name) {
        console.log('loaded ' + name);
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
                    execute: function () {
                        var self = this;

                        function getValidation(name, value):{error:boolean;message?:string} {
                            var valArr = self['validations'][name];
                            if (!isNull(valArr))
                                for (var val in valArr) {
                                    if (!obSelf['validations'][valArr[val]].check(value)) {
                                        var al = self['alias'][name];
                                        al = (al == undefined) ? name : al;
                                        return {
                                            error: true,
                                            message: obSelf['validations'][valArr[val]].alert(al)
                                        }
                                    }
                                }
                            return {error: false};
                        }

                        if (!isNull(self.args) && !isNull(self['validations']))
                            for (var p in self.validations) {
                                var ret = getValidation(p, self.args[p]);
                                if (ret.error)return ret;
                            }
                        client[this.mName](self.args).execute((response)=> {
                            this.response = response;
                            console.log(response);
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
        var self = this;
        this.client = name;
        this.loadApi((client=> {
            self.api = {};
            self.attribClient(client, self.api);
            self.afterLoad(name);
        }));
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

    get(id):Resolve {
        return super.load((client)=> {
            return client.get({id: id});
        });
    }

    create(article:ArticleCreation):Resolve {
        return super.load((client)=> {
            return client.create(article);
        });
    }

    listMy():Resolve {
        return super.load((client)=> {
            return client.list.my();
        });
    }

    listPublic():Resolve {
        return super.load((client)=> {
            return client.list.public();
        });
    }

    update(article:ArticleUpdate):Resolve {
        return super.load((client)=> {
            return client.update(article);
        });
    }

    delete(ids):Resolve {
        return super.load((client)=> {
            return client.delete({ids: ids});
        });
    }
}

class PhotoTokenService extends ClientBabyHelp {
    constructor() {
        super();
        this.client = 'photoToken';
    }

    getPhotoToken() {
        return this.load((client)=> {
            return client.getuploadurl();
        });
    }
}
