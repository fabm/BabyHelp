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
                _this.config['approval_prompt'] = 'force';
            }
            return _this.config;
        };
    }
    ClientLoader.logout = function () {
        gapi.auth.setToken(null);
    };

    ClientLoader.prototype.login = function (callback) {
        this.checkAuth(false, callback);
    };

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
                ClientLoader.logged = false;
            } else {
                ClientLoader.logged = true;
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
        } else if (self.requireAuth && !ClientLoader.logged)
            self.checkAuth(true, function () {
                if (ClientLoader.logged) {
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
        } else if (self.requireAuth && !ClientLoader.logged)
            self.checkAuth(true, function () {
                if (ClientLoader.logged) {
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
    ClientLoader.logged = false;
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
        function create(alias, name) {
            return {
                name: name,
                alias: alias,
                role: false
            };
        }

        var all = [];
        all.push(create('técnico de saúde', 'HEALTHTEC'));
        all.push(create('administrador', 'ADMINISTRATOR'));
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
            return client.getRoles({ email: user.email });
        });

        function then(onSuccess, onError, onUnauthorized) {
            return loader.then(function (response) {
                var allRoles = UserService.loadAllRoles();
                allRoles.forEach(function (value, index, arr) {
                    value.role = response.body.indexOf(value.name) != -1;
                });
                user.roles = allRoles;
                onSuccess(null);
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

                return client.updateRoles({ 'email': user.email, 'roles': rolesSelected });
            }
        });
    };
    return UserService;
})(ClientBabyHelp);

var ArticlesService = (function (_super) {
    __extends(ArticlesService, _super);
    function ArticlesService() {
        _super.call(this);
        this.client = 'article';
    }
    ArticlesService.prototype.get = function (id) {
        return _super.prototype.load.call(this, function (client) {
            return client.get(id);
        });
    };

    ArticlesService.prototype.create = function (article) {
        return _super.prototype.load.call(this, function (client) {
            return client.create(article);
        });
    };

    ArticlesService.prototype.listMy = function () {
        return _super.prototype.load.call(this, function (client) {
            return client.list.my();
        });
    };

    ArticlesService.prototype.update = function (article) {
        return _super.prototype.load.call(this, function (client) {
            return client.update(article);
        });
    };

    ArticlesService.prototype.delete = function (ids) {
        return _super.prototype.load.call(this, function (client) {
            return client.delete({ ids: ids });
        });
    };
    return ArticlesService;
})(ClientBabyHelp);
//# sourceMappingURL=gapis.js.map
