var Log = (function () {
    function Log() {
    }
    Log.prt = function (msg) {
        console.trace();
        window.console.log(msg);
    };

    Log.prtError = function (msg) {
        console.trace();
        window.console.log(msg);
    };

    Log.cbr = function (response) {
        console.trace();
        window.console.log(response);
    };

    Log.cbf = function (response) {
        return function () {
            Log.prt(response);
        };
    };

    Log.transfer = function (obje) {
        var fn = function (objo) {
            obje = obje;
        };
        return fn;
    };
    return Log;
})();

function isNull(parameter) {
    if (parameter == undefined || parameter == null)
        return true;
    return false;
}

var isLocal = window.location.hostname == 'localhost';
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

var CalbackHelperResponse = (function () {
    function CalbackHelperResponse() {
    }
    CalbackHelperResponse.prototype.responseCallback = function (response) {
        this.response = response;
        this.type = 'sucess';
    };

    CalbackHelperResponse.prototype.responseCallbackError = function (response) {
        this.response = response;
        this.type = 'error';
    };
    return CalbackHelperResponse;
})();

var MyClient = (function () {
    function MyClient() {
        this.version = 'v1';
    }
    MyClient.getAuthConfig = function (immediate) {
        return {
            client_id: '942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com',
            scope: ['https://www.googleapis.com/auth/userinfo.email'],
            immediate: immediate
        };
    };

    MyClient.auth = function (immediate, afterAuth) {
        afterAuth = !isNull(afterAuth) ? afterAuth : function () {
        };
        immediate = (isNull(immediate)) ? true : false;
        gapi.auth.authorize(MyClient.getAuthConfig(immediate), afterAuth);
    };

    MyClient.authLoad = function (callback) {
        gapi.load('auth', callback);
    };

    MyClient.isAuthLoaded = function () {
        return !isNull(gapi.auth);
    };

    MyClient.responseCallbackResolver = function (resolverCallbacks) {
        return function (response) {
            resolverCallbacks = isNull(resolverCallbacks) ? {
                responseCallback: Log.cbr,
                responseCallbackError: Log.cbr
            } : resolverCallbacks;

            if (!isNull(response.error)) {
                if (response.code == 400) {
                    resolverCallbacks.responseCallbackError({
                        code: Number(response.message.split(':')[0]),
                        message: response.message.split(':')[1]
                    });
                } else {
                    resolverCallbacks.responseCallbackError({
                        code: response.code,
                        message: response.message
                    });
                }
            } else {
                resolverCallbacks.responseCallback(response);
            }
        };
    };

    MyClient.prototype.isLoaded = function () {
        if (isNull(gapi.client))
            return false;
        return !isNull(gapi.client[this.apiName]);
    };

    MyClient.prototype.loadClient = function (afterLoad) {
        var _this = this;
        if (isNull(afterLoad))
            afterLoad = function () {
                Log.prt('foi carregada a API ' + _this.apiName);
            };
        gapi.client.load(this.apiName, this.version, afterLoad, MyClient.root);
    };
    MyClient.root = 'http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api";

    MyClient.userInfo = function () {
        return gapi.client.oauth2.userinfo.v2.me.get().execute(Log.cbr);
    };
    return MyClient;
})();

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

var UserBHClient = (function (_super) {
    __extends(UserBHClient, _super);
    function UserBHClient() {
        this.apiName = 'userBH';
        _super.call(this);
    }
    UserBHClient.getNewUserClient = function () {
        return new UserBHClient();
    };

    UserBHClient.getRolesName = function (roles) {
        var rolesStr = [];

        for (var r in roles) {
            rolesStr.push(UserBHClient.getRoleName(roles[r]));
        }

        return rolesStr;
    };

    UserBHClient.getRoleName = function (role) {
        switch (role) {
            case 0 /* admin */:
                return 'ADMINISTRATOR';
            case 1 /* healthTec */:
                return 'HEALTHTEC';
        }
        throw 'role inexistente';
    };

    UserBHClient.getAllRoles = function () {
        return [0 /* admin */, 1 /* healthTec */];
    };

    UserBHClient.getRole = function (roleName) {
        switch (roleName) {
            case 'ADMINISTRATOR':
                return 0 /* admin */;
            case 'HEALTHTEC':
                return 1 /* healthTec */;
        }
        throw 'role inexistente';
    };

    UserBHClient.getRolesModel = function (rolesStr) {
        var all = UserBHClient.getRolesName(UserBHClient.getAllRoles());
        var rolesModel = {};
        for (var r in all) {
            rolesModel[all[r]] = false;
        }
        if (!isNull(rolesStr))
            for (var r in rolesStr) {
                all[rolesStr[r]] = true;
            }

        var ret = [];
        for (var r in all) {
            ret.push({ name: all[r], role: rolesModel[all[r]] });
        }
    };

    UserBHClient.getRolesMissing = function (rolesStr) {
        var roles = [];
        var allRoles = UserBHClient.getAllRoles();

        for (var r in allRoles) {
            var inAllRolesOnly = true;
            for (var rs in rolesStr) {
                var role = UserBHClient.getRole(rolesStr[rs]);
                if (role == allRoles[r]) {
                    inAllRolesOnly = false;
                    break;
                }
            }
            if (inAllRolesOnly) {
                roles.push(allRoles[r]);
            }
        }
        return roles;
    };

    UserBHClient.prototype.currentEmail = function (callback) {
        gapi.client.userBH.currentEmail().execute(MyClient.responseCallbackResolver(callback));
    };

    UserBHClient.prototype.checkRoles = function (callback) {
        gapi.client.userBH.checkRoles().execute(MyClient.responseCallbackResolver(callback));
    };

    UserBHClient.prototype.updateRoles = function (params, callback) {
        gapi.client.userBH.updateRoles(params).execute(MyClient.responseCallbackResolver(callback));
    };

    UserBHClient.prototype.removeRole = function (params, callback) {
        gapi.client.userBH.removeRole(params).execute(MyClient.responseCallbackResolver(callback));
    };

    UserBHClient.prototype.addRole = function (params, callback) {
        gapi.client.userBH.addRole(params).execute(MyClient.responseCallbackResolver(callback));
    };

    UserBHClient.prototype.list = function (callback) {
        gapi.client.userBH.list().execute(MyClient.responseCallbackResolver(callback));
    };

    UserBHClient.prototype.getRoles = function (params, callback) {
        gapi.client.userBH.getRoles(params).execute(MyClient.responseCallbackResolver(callback));
    };
    return UserBHClient;
})(MyClient);
/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="gapis.ts" />

var app = angular.module("babyhelp", ['ui.router', 'ui.growl', 'ngCookies', 'ngResource']);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state('users-list', {
        url: "/users",
        templateUrl: "views/usersmng/userslst.html",
        controller: Users.ListUsersCtrl
    }).state('users-edit', {
        url: "/users/edit/:email",
        templateUrl: "views/usersmng/usersup.html",
        controller: Users.UpdateUsersCtrl
    }).state('default', {
        url: "/",
        templateUrl: "views/default.html",
        controller: DefaultCtrl
    });
});

app.directive('modalDialog', function () {
    return {
        restrict: 'E',
        scope: {
            show: '=',
            data: '='
        },
        replace: true,
        transclude: true,
        link: function (scope, element, attrs) {
            scope.dialogStyle = {};
            if (attrs.width)
                scope.dialogStyle.width = attrs.width;
            if (attrs.height)
                scope.dialogStyle.height = attrs.height;
            scope.hideModal = function () {
                scope.show = false;
            };
        },
        templateUrl: 'views/modal.html'
    };
});

var growlMessage = null;

var Users;
(function (Users) {
    function ListUsersCtrl($scope, $growl, $state, $resource) {
        var scopeUserList = $scope;
        $scope.modalShown = false;
        $scope.template = "view/userslst.html";

        var q = $resource(Api.root + '/userBH/v1/list', null, {
            'list': { method: 'GET' }
        });

        q.get(Log.cbr);

        $scope.state = 'wait';
        $scope.toggleModal = function () {
            $scope.modalShown = !$scope.modalShown;
        };

        if (growlMessage != null) {
            $growl.box('Update', growlMessage, {
                class: 'success', sticky: false, timeout: 3000
            }).open();
            growlMessage = null;
        }

        $scope['showUsersList'] = function () {
            switch ($scope.state) {
                case 'confirmDelete':
                case 'list':
                    return true;
                default:
                    return false;
            }
        };

        function loadClient(callback) {
            if (!Api.isClientLoaded(0 /* userBH */)) {
                Api.loadClient(0 /* userBH */, callback);
            } else {
                callback();
            }
        }

        loadClient(function () {
            Api.User.list().execute(function (response) {
                if (!response.error) {
                    $scope.state = 'list';
                    $scope.users = response.body;
                    $scope.$digest();
                } else {
                    growlMessage = response.error.message;
                    $state.go('default', null, { reload: true });
                }
            });
        });

        $scope.addRole = function () {
            $scope.state = ('addRole');
            var data = {
                roles: UserBHClient.getAllRoles(),
                state: $scope.state
            };
            $scope.data = data;
            $scope.toggleModal();
        };
    }
    Users.ListUsersCtrl = ListUsersCtrl;

    function UpdateUsersCtrl($scope, $state, $stateParams, $q) {
        var user = { email: '' };

        function loadClient(callback) {
            if (!Api.isClientLoaded(0 /* userBH */)) {
                $scope.loading = 'A autenticar...';
                Api.auth(function (state) {
                    $scope.loading = 'A carregar cliente...';
                    $scope.$digest();
                    Api.loadClient(0 /* userBH */, function () {
                        $scope.loading = undefined;
                        callback();
                    });
                });
            } else {
                callback();
            }
        }

        if ($stateParams.email === '') {
            $scope.state = 'create';
            user.roles = Api.User.getAllRoles();
        } else {
            $scope.state = 'update';
            user.email = $stateParams.email;
            loadClient(function () {
                Api.User.getRoles(user).execute(function () {
                    $scope.$digest();
                });
            });
        }

        $stateParams.email;
        var scopeEdit = $scope;

        function updated(response) {
            growlMessage = 'Updated user';
            $state.go('users-list', null, { reload: true });
        }

        scopeEdit.user = user;

        $scope.save = function () {
            loadClient(function () {
                Api.User.updateRoles(user).execute(updated);
            });
        };
    }
    Users.UpdateUsersCtrl = UpdateUsersCtrl;
})(Users || (Users = {}));

var DefaultViewCtrl = (function () {
    function DefaultViewCtrl($scope) {
    }
    return DefaultViewCtrl;
})();

function DefaultCtrl($scope, $cookies, $state, $location, $growl) {
    if (growlMessage != null) {
        $growl.box('Erro', growlMessage, {
            class: 'danger', sticky: false, timeout: 3000
        }).open();
        growlMessage = null;
    }
}

function AuthButtonCtrl($scope, $cookies, $state, $location, $rootScope) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        update(false);
    });

    if (!isNull($cookies.logged)) {
        Api.logged = $cookies.logged;
    }
    var apiAuthCallback = function (state) {
        $scope.state = Api.logged;
        $cookies.logged = Api.logged;
        update(true);
    };

    $scope.authaction = function () {
        if (Api.logged) {
            $scope.logout();
        } else {
            $scope.login();
        }
    };

    if (window.location.hostname !== 'localhost') {
        Api.auth(apiAuthCallback);
    }

    $scope.logout = function () {
        Api.logout();
        $scope.state = $cookies.logged = Api.logged;
        $state.go('default', null, { reload: true });
    };
    $scope.login = function () {
        Api.login(apiAuthCallback);
    };

    $scope.state = Api.logged;

    var update = function (apply) {
        var scope = $scope;
        scope.authvar = $scope.state ? "logout" : "login";
        if (apply)
            scope.$digest();
    };
    update(false);
}

app.controller(['AuthButtonCtrl', AuthButtonCtrl]);

var Params = (function () {
    function Params() {
        this.method = 'GET';
        this.callback = Log.cbr;
    }
    return Params;
})();
