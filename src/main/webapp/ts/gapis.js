/// <reference path="ext/gapi/gapi.d.ts" />
/// <reference path="lib.ts" />

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

var Role;
(function (Role) {
    Role[Role["admin"] = 0] = "admin";
    Role[Role["healthTec"] = 1] = "healthTec";
})(Role || (Role = {}));

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
