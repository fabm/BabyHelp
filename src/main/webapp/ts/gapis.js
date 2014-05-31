/// <reference path="ext/gapi/gapi.d.ts" />
/// <reference path="lib.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var auth = {
    _getConfig: function (immediate) {
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
    login: function (callbacks, immediate) {
        if (isNull(immediate))
            immediate = false;

        var config = isNull(config) ? auth._getConfig(immediate) : config;

        gapi.auth.authorize(config, function (response) {
            if (!isNull(response) && isNull(response.error)) {
                auth.islogged = true;
                callbacks.logged();
            } else {
                auth.islogged = false;
                callbacks.notlogged();
            }
        });
    },
    checkauth: function (callbacks) {
        if (auth.islogged) {
            callbacks.logged();
        } else {
            auth._getConfig(true);
            auth.login(callbacks, true);
        }
    },
    islogged: false,
    load: function (callbacks) {
        var authLoad = function () {
            auth.checkauth(callbacks);
        };
        gapi.load('auth', authLoad);
    }, logout: function () {
        gapi.auth.setToken(null);
        this.islogged = false;
    }
};

var StateLoading;
(function (StateLoading) {
    StateLoading[StateLoading["loadingGAPI"] = 0] = "loadingGAPI";
    StateLoading[StateLoading["authenticating"] = 1] = "authenticating";
    StateLoading[StateLoading["clientLoading"] = 2] = "clientLoading";
    StateLoading[StateLoading["callService"] = 3] = "callService";
    StateLoading[StateLoading["authFail"] = 4] = "authFail";
})(StateLoading || (StateLoading = {}));

var ClientLoader = (function () {
    function ClientLoader() {
        var _this = this;
        this.version = 'v1';
        this.config = {};
        this.getAuthConfig = function (immediate) {
            _this.config['immediate'] = immediate;

            if (!immediate) {
                _this.config['authuser'] = "";
            }
            return _this.config;
        };
    }
    ClientLoader.prototype.setClientID = function (clientID) {
        this.config['client_id'] = clientID;
    };

    ClientLoader.prototype.setScope = function (scope) {
        this.config['scope'] = scope;
    };

    ClientLoader.prototype.checkAuth = function (immediate, callback) {
        var self = this;
        gapi.auth.authorize(self.getAuthConfig(immediate), function (response) {
            if (response.error) {
                self.logged = false;
            } else {
                self.logged = true;
            }
            callback();
        });
    };

    ClientLoader.prototype.callCBState = function (state) {
        if (this.cbState != null)
            this.cbState(state);
    };

    ClientLoader.prototype.loadApi = function (callback) {
        var self = this;
        if (isNull(gapi.auth)) {
            self.callCBState(0 /* loadingGAPI */);
            gapi.load('auth', function () {
                self.callCBState(1 /* authenticating */);
                self.loadApi(callback);
            });
        } else if (self.requireAuth && !self.logged)
            self.checkAuth(true, function () {
                if (self.logged) {
                    self.callCBState(2 /* clientLoading */);
                    self.loadApi(callback);
                } else {
                    self.callCBState(4 /* authFail */);
                }
            });
        else if (isNull(gapi.client[self.client])) {
            gapi.client.load(self.client, self.version, function () {
                self.callCBState(3 /* callService */);
                callback(gapi.client[self.client]);
            }, self.apiUrl);
        }
    };

    ClientLoader.prototype.load = function (callback) {
        var self = this;
        var onSuccess;
        var onError;
        var onNotAuthorized;
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
            apiClient.execute(function (response) {
                apiResponse = response;
                resolve();
            });
        }

        if (isNull(gapi.auth)) {
            self.callCBState(0 /* loadingGAPI */);
            gapi.load('auth', function () {
                self.callCBState(1 /* authenticating */);
                self.load(callback);
            });
        } else if (self.requireAuth && !self.logged)
            self.checkAuth(true, function () {
                if (self.logged) {
                    self.callCBState(2 /* clientLoading */);
                    self.load(callback);
                } else {
                    self.callCBState(4 /* authFail */);
                }
            });
        else if (isNull(gapi.client[self.client])) {
            gapi.client.load(self.client, self.version, function () {
                self.callCBState(3 /* callService */);
                execute(callback(gapi.client[self.client]));
            }, self.apiUrl);
        } else {
            self.callCBState(3 /* callService */);
            execute(callback(gapi.client[self.client]));
        }

        return {
            then: function (cbOnSuccess, cbOnError, cbOnNotAuthorized) {
                onSuccess = cbOnSuccess;
                onError = cbOnError;
                onNotAuthorized = cbOnNotAuthorized;
                resolve();
            }
        };
    };
    return ClientLoader;
})();

var ClientBabyHelp = (function (_super) {
    __extends(ClientBabyHelp, _super);
    function ClientBabyHelp() {
        _super.call(this);
        this.apiUrl = 'http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api";
        _super.prototype.setClientID.call(this, '942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com');
        _super.prototype.setScope.call(this, ['https://www.googleapis.com/auth/userinfo.email']);
    }
    return ClientBabyHelp;
})(ClientLoader);

var UserService = (function (_super) {
    __extends(UserService, _super);
    function UserService() {
        _super.call(this);
        this.client = 'userBH';
    }
    UserService.loadAllRoles = function () {
        function Create(alias, name) {
            this.name = name;
            this.alias = alias;
            this.role = false;
        }

        var all = [];
        all.push(new Create('técnico de saúde', 'HEALTHTEC'));
        all.push(new Create('administrador', 'ADMINISTRATOR'));
        return all;
    };

    UserService.prototype.list = function () {
        var self = this;
        return _super.prototype.load.call(this, function (client) {
            return client.list();
        });
    };

    UserService.prototype.getRoles = function (user) {
        var loader = _super.prototype.load.call(this, function (client) {
            return client.getRoles({ mail: user.email });
        });

        function then(onSuccess, onError, onUnauthorized) {
            return loader.then(function (response) {
                var allRoles = UserService.loadAllRoles();
                allRoles.forEach(function (value, index, arr) {
                    value.role = response.body.roles.indexOf(value.name) != -1;
                });
                onSuccess(allRoles);
            }, onError, onUnauthorized);
        }

        return {
            then: then
        };
    };

    UserService.prototype.updateRoles = function (user) {
        return _super.prototype.load.call(this, function (client) {
             {
                var rolesSelected = [];
                user.roles.forEach(function (value, index, arr) {
                    if (value.role)
                        rolesSelected.push(value.name);
                });
                return client.update({ 'email': user.email, 'roles': user.roles });
            }
        });
    };
    return UserService;
})(ClientBabyHelp);

var Api;
(function (Api) {
    (function (ApiClient) {
        ApiClient[ApiClient["userBH"] = 0] = "userBH";
    })(Api.ApiClient || (Api.ApiClient = {}));
    var ApiClient = Api.ApiClient;

    Api.loadClient = function (client, callback) {
        var version;
        var name;
        if (typeof client === 'number') {
            version = 'v1';
            name = Api.ApiClient[client];
        } else if (typeof client === 'object') {
            version = client.version;
            name = client.name;
        }

        function loadClient(name) {
            gapi.client.load(name, version, callback, Api.root);
        }

        if (isNull(gapi.client)) {
            Api.auth(function (state) {
                loadClient(name);
            });
        } else if (!Api.isClientLoaded(name)) {
            loadClient(name);
        }
    };

    function getClientGapi(client) {
        var apiStr = Api.ApiClient[client];
        var clientApi = gapi.client[apiStr];
        return clientApi;
    }

    (function (User) {
        var AllRoles;
        (function (AllRoles) {
            AllRoles[AllRoles["ADMINISTRATOR"] = 0] = "ADMINISTRATOR";
            AllRoles[AllRoles["HEALTHTEC"] = 1] = "HEALTHTEC";
        })(AllRoles || (AllRoles = {}));
        User.allRolesAlias = {};

        User.allRolesAlias[0 /* ADMINISTRATOR */] = 'administrador';
        User.allRolesAlias[1 /* HEALTHTEC */] = 'ténico de saúde';

        var allRolesSize = 2;

        var client;

        function loadClient() {
            if (isNull(client)) {
                client = getClientGapi(0 /* userBH */);
            }
        }

        function getAllRoles() {
            var roles = [];
            for (var r = 0; r < allRolesSize; r++) {
                roles.push({ nome: AllRoles[r], alias: User.allRolesAlias[r], role: false });
            }
            return roles;
        }
        User.getAllRoles = getAllRoles;

        function getRoles(user) {
            loadClient();
            var executor = {
                execute: function (callback) {
                    client.getRoles({ email: user.email }).execute(function (response) {
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
        User.getRoles = getRoles;

        function updateRoles(user) {
            loadClient();
            var arrRoles = [];
            for (var r in user.roles) {
                if (user.roles[r].role)
                    arrRoles.push(user.roles[r].nome);
            }
            return client.updateRoles({ 'email': user.email, 'roles': arrRoles });
        }
        User.updateRoles = updateRoles;

        function list() {
            loadClient();
            return client.list();
        }
        User.list = list;
    })(Api.User || (Api.User = {}));
    var User = Api.User;
})(Api || (Api = {}));

var Api;
(function (Api) {
    Api.root;

    (function (ApiState) {
        ApiState[ApiState["loadingAuth"] = 0] = "loadingAuth";
        ApiState[ApiState["auth"] = 1] = "auth";
        ApiState[ApiState["client"] = 2] = "client";
    })(Api.ApiState || (Api.ApiState = {}));
    var ApiState = Api.ApiState;

    var Params = (function () {
        function Params() {
            this.client = undefined;
            this.version = 'v1';
            this.requireAuth = true;
            this.calbackLoading = function (state) {
                Log.prt('state:' + ApiState[state]);
            };
        }
        return Params;
    })();
    Api.Params = Params;

    Api.logged = true;

    var getAuthConfig = function (immediate) {
        var config = {
            client_id: '942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com',
            scope: ['https://www.googleapis.com/auth/userinfo.email'],
            immediate: immediate
        };

        if (!immediate) {
            config['authuser'] = "";
        }
        return config;
    };

    Api.logout = function () {
        gapi.auth.setToken(null);
        Api.logged = false;
    };

    var checkAuth = function (immediate, authCallback) {
        gapi.auth.authorize(getAuthConfig(immediate), function (response) {
            if (response.error) {
                Api.logged = false;
            } else {
                Api.logged = true;
            }
            authCallback(1 /* auth */);
        });
    };

    Api.login = function (authCallback) {
        checkAuth(false, authCallback);
    };

    Api.auth = function (authCallback) {
        if (isNull(gapi.auth)) {
            gapi.load('auth', function () {
                authCallback(0 /* loadingAuth */);
            });
        } else
            checkAuth(true, authCallback);
    };

    Api.load = function (params) {
        var afterAuth = function () {
            if (isNull(gapi.client) || isNull(gapi.client[params.client])) {
                gapi.client.load(params.client, params.version, function () {
                    params.calbackLoading(2 /* client */);
                }, Api.root);
            }
        };

        if (params.requireAuth)
            Api.auth(function (authState) {
                params.calbackLoading(authState);
                afterAuth();
            });
        else
            afterAuth();
    };

    Api.isClientLoaded = function (client) {
        var strClient = Api.ApiClient[client];
        return !isNull(gapi.client[strClient]);
    };
})(Api || (Api = {}));

Api.root = 'http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api";
//# sourceMappingURL=gapis.js.map
