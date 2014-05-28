/// <reference path="ext/gapi/gapi.d.ts" />
/// <reference path="lib.ts" />

interface AuthResponse {
    logged:()=>void;
    notlogged:()=>void;
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


enum Role{
    admin, healthTec
}

enum StateLoading{
    loadingGAPI , authenticating, clientLoading, callService, authFail
}

class ClientLoader {

    private apiUrl;
    private cbState:(state:StateLoading)=>void;
    private client:string;
    private version:string = 'v1';
    private requireAuth:boolean;
    private logged:boolean;
    private config = {};

    constructor(cbState:(state:StateLoading)=>void) {
        this.cbState = cbState;
    }

    setApiUrl(apiUrl:string) {
        this.apiUrl = apiUrl;
    }

    setClient(client:string) {
        this.client = client;
    }

    setVersion(version:string) {
        this.version = version;
    }

    setRequireAuth(requireAuth:boolean) {
        this.requireAuth = requireAuth;
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

    private checkAuth(immediate, callback:()=>void) {
        var self = this;
        gapi.auth.authorize(self.getAuthConfig(immediate), (response)=> {
            if (response.error) {
                self.logged = false
            } else {
                self.logged = true;
            }
            callback();
        });
    }

    load(callback:(client)=>{
        resolve:(success:(response)=>void,error:(response)=>void)=>void
    }):void {
        var self = this;

        function responseResolver(apiMethod){
            var fnOnSuccess:(response)=>void;
            var fnOnError:(response)=>void;
            function resolve(success:(response)=>void,error:(response)=>void){
                fnOnSuccess = success;
                fnOnError = error;
            }
            apiMethod.execute((response)=>{
                if(!isNull(response.error)){
                    fnOnSuccess(response);
                }else{
                    fnOnError(response);
                }
            });
            return{resolve:resolve}
        }

        if (isNull(gapi.auth)) {
            self.cbState(StateLoading.loadingGAPI);
            gapi.load('auth', ()=> {
                self.cbState(StateLoading.authenticating);
                self.load(callback);
            });
        } else if (self.requireAuth && !self.logged)
            self.checkAuth(true, ()=> {
                if (self.logged) {
                    self.cbState(StateLoading.clientLoading);
                    self.load(callback);
                }
                else {
                    self.cbState(StateLoading.authFail);
                }
            });
        else if (isNull(gapi.client[self.client])) {
            gapi.client.load(self.client, self.version, ()=> {
                self.cbState(StateLoading.callService);
                responseResolver(callback(gapi.client[self.client]));
            }, self.apiUrl);
        }else{
            self.cbState(StateLoading.callService);
            responseResolver(callback(gapi.client[self.client]));
        }
    }

}

class ClientBabyHelp extends ClientLoader {
    constructor(cBState:(state:StateLoading)=>void) {
        super(cBState);
        super.setApiUrl('http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api");
        super.setClientID('942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com');
        super.setScope(['https://www.googleapis.com/auth/userinfo.email']);
    }
}

class UserLoader extends ClientBabyHelp {
    constructor() {
        super((state:StateLoading)=> {
            Log.prt(state);
        });

        super.setClient('userBH');
    }

    list(callback) {
        var self = this;
        super.load((client)=> {
            return client.list();
        });
    }
}


module Api {

    export enum ApiClient{
        userBH
    }


    export var loadClient = (client:any, callback:()=>void)=> {
        var version;
        var name;
        if (typeof client === 'number') {//is enum -> ApiClient
            version = 'v1';
            name = Api.ApiClient[client];
        } else if (typeof client === 'object') {
            version = client.version;
            name = client.name;
        }

        function loadClient(name:string) {
            gapi.client.load(name, version, callback, root);
        }

        if (isNull(gapi.client)) {
            Api.auth((state:Api.ApiState)=> {
                loadClient(name);
            });
        } else if (!isClientLoaded(name)) {
            loadClient(name);
        }
    }

    function getClientGapi(client:Api.ApiClient) {
        var apiStr = Api.ApiClient[client];
        var clientApi = gapi.client[apiStr];
        return clientApi
    }

    export module User {


        enum AllRoles{
            ADMINISTRATOR, HEALTHTEC
        }
        export var allRolesAlias:{
            [index:number]:string
        } = {};

        allRolesAlias[AllRoles.ADMINISTRATOR] = 'administrador';
        allRolesAlias[AllRoles.HEALTHTEC] = 'ténico de saúde';


        var allRolesSize = 2;

        var client:any;

        function loadClient() {
            if (isNull(client)) {
                client = getClientGapi(Api.ApiClient.userBH);
            }
        }

        export function getAllRoles():Array<{nome:string;alias:string;role:boolean;}> {
            var roles = [];
            for (var r = 0; r < allRolesSize; r++) {
                roles.push({nome: AllRoles[r], alias: allRolesAlias[r], role: false});
            }
            return roles;
        }

        export function getRoles(user) {
            loadClient();
            var executor = {
                execute: (callback:()=>void)=> {
                    client.getRoles({email: user.email}).execute((response)=> {
                        var allRoles = getAllRoles();
                        for (var r in response.body) {
                            var role = AllRoles[response.body[r]];
                            allRoles[role].role = true;
                        }
                        user.roles = allRoles;
                        callback();
                    });
                }
            };
            return executor;
        }

        export function updateRoles(user:{email:string;roles:Array<{nome:string;role:boolean}>}):Executor {
            loadClient();
            var arrRoles = [];
            for (var r in user.roles) {
                if (user.roles[r].role)
                    arrRoles.push(user.roles[r].nome);
            }
            return client.updateRoles({'email': user.email, 'roles': arrRoles});
        }

        export function list() {
            loadClient();
            return client.list();
        }
    }
}

module Api {

    export interface Executor {
        execute:(callback:(response:any)=>void)=>void;
    }


    export var root;

    export enum ApiState{
        loadingAuth, auth, client
    }

    export class Params {
        client:string = undefined;
        version:string = 'v1';
        requireAuth = true;
        calbackLoading:{(state:ApiState):void} = (state:ApiState)=> {
            Log.prt('state:' + ApiState[state]);
        }
    }

    export var logged = true;

    var getAuthConfig = (immediate:boolean)=> {
        var config = {
            client_id: '942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com',
            scope: ['https://www.googleapis.com/auth/userinfo.email'],
            immediate: immediate
        };

        if (!immediate) {
            config['authuser'] = "";
        }
        return config;
    }

    export var logout = ()=> {
        gapi.auth.setToken(null);
        logged = false;
    }

    var checkAuth = (immediate, authCallback:(authState:ApiState)=>void)=> {
        gapi.auth.authorize(getAuthConfig(immediate), (response)=> {
            if (response.error) {
                Api.logged = false
            } else {
                Api.logged = true;
            }
            authCallback(ApiState.auth);
        });
    }

    export var login = (authCallback:(authState:ApiState)=>void)=> {
        checkAuth(false, authCallback);
    }

    export var auth = (authCallback:(authState:ApiState)=>void)=> {
        if (isNull(gapi.auth)) {
            gapi.load('auth', ()=> {
                authCallback(ApiState.loadingAuth);
            });
        } else
            checkAuth(true, authCallback);
    }


    export var load = (params:Params) => {
        var afterAuth = ()=> {
            if (isNull(gapi.client) || isNull(gapi.client[params.client])) {
                gapi.client.load(params.client, params.version, ()=> {
                    params.calbackLoading(ApiState.client);
                }, root);
            }
        }

        if (params.requireAuth)
            auth((authState)=> {
                params.calbackLoading(authState);
                afterAuth();
            });
        else
            afterAuth();

    }

    export var isClientLoaded = (client:ApiClient)=> {
        var strClient = ApiClient[client];
        return !isNull(gapi.client[strClient]);
    }

}

Api.root = 'http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api";


