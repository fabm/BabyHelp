/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="services.ts" />

var RouteState = {
    $state: null,
    userList: 'users-list',
    usersEdit: 'users-edit',
    home: 'default',
    goto: function (state) {
        this.$state.go(state, null, { reload: true });
    }
};

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/");

    $stateProvider.state(RouteState.userList, {
        url: "/users",
        templateUrl: "views/usersmng/userslst.html",
        controller: Users.ListUsersCtrl
    }).state(RouteState.usersEdit, {
        url: "/users/edit/:email",
        templateUrl: "views/usersmng/usersup.html",
        controller: Users.UpdateUsersCtrl
    }).state(RouteState.home, {
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

var GrowlObject = (function () {
    function GrowlObject() {
        this.type = 0;
    }
    GrowlObject.prototype.setMessage = function (message, type) {
        this.msg = message;
        this.type = type;
    };

    GrowlObject.prototype.closeGrowl = function () {
        this.msg = null;
    };

    GrowlObject.prototype.isOpen = function () {
        return this.msg != null;
    };

    GrowlObject.prototype.showGrowl = function ($growl) {
        if (isNull(this.msg))
            return;
        var strType;
        var title;
        if (this.type == 0) {
            strType = 'success';
            title = 'Informação';
        } else if (this.type == 1) {
            strType = 'danger';
            title = 'Erro';
        }
        $growl.box(title, this.msg, {
            class: strType, sticky: false, timeout: 3000
        }).open();
    };
    GrowlObject.typeMessage = {
        success: 0, error: 1
    };
    return GrowlObject;
})();

var GrowlAndState = (function () {
    function GrowlAndState($growl, $state) {
        this.type = 0;
        this.$growl = $growl;
        this.$state = $state;
    }
    GrowlAndState.prototype.setMessage = function (message, type) {
        this.msg = message;
        this.type = type;
    };

    GrowlAndState.prototype.closeGrowl = function () {
        this.msg = null;
    };

    GrowlAndState.prototype.isOpen = function () {
        return this.msg != null;
    };

    GrowlAndState.prototype.showGrowl = function ($growl) {
        if (isNull(this.msg))
            return;
        var strType;
        var title;
        if (this.type == 0) {
            strType = 'success';
            title = 'Informação';
        } else if (this.type == 1) {
            strType = 'danger';
            title = 'Erro';
        }
        $growl.box(title, this.msg, {
            class: strType, sticky: false, timeout: 3000
        }).open();
    };
    GrowlAndState.typeMessage = {
        success: 0, error: 1
    };
    return GrowlAndState;
})();

app.factory('gns', function ($state, $growl) {
    var gns = new GrowlAndState($growl, $state);
    return gns;
});

var growlObject = new GrowlObject();

var Users;
(function (Users) {
    function ListUsersCtrl($scope, $growl, $state, gns) {
        $scope.modalShown = false;
        $scope.template = "view/userslst.html";

        Log.prt(gns);

        function loadClient(callback) {
            if (!Api.isClientLoaded(0 /* userBH */)) {
                Api.loadClient(0 /* userBH */, callback);
            } else {
                callback();
            }
        }

        loadClient(function () {
            Api.User.list().execute(function (response) {
                if (isNull(response.error)) {
                    $scope.state = 'list';
                    $scope.users = response.body;
                    $scope.$digest();
                } else {
                    growlObject.setMessage(response.error.message, GrowlObject.typeMessage.error);
                    RouteState.$state = $state;
                    RouteState.goto(RouteState.home);
                }
            });
        });

        $scope.state = 'wait';
        $scope.toggleModal = function () {
            $scope.modalShown = !$scope.modalShown;
        };

        if (growlObject.isOpen()) {
            growlObject.showGrowl($growl);
            growlObject.closeGrowl();
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
    }
    Users.ListUsersCtrl = ListUsersCtrl;

    function UpdateUsersCtrl($scope, $state, $stateParams, $q, $growl) {
        var user = { email: null };

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

        RouteState.$state = $state;
        function updated(response) {
            if (isNull(response.error)) {
                growlObject.setMessage('Utilizador atualizado', GrowlObject.typeMessage.success);
                RouteState.goto(RouteState.userList);
            } else {
                growlObject.setMessage(response.error.message, GrowlObject.typeMessage.error);
                if (response.error.code === 401) {
                    RouteState.goto(RouteState.home);
                } else {
                    growlObject.showGrowl($growl);
                    growlObject.closeGrowl();
                }
            }
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
    if (growlObject.isOpen()) {
        growlObject.showGrowl($growl);
        growlObject.closeGrowl();
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
        RouteState.$state = $state;
        RouteState.goto(RouteState.home);
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
//# sourceMappingURL=app.js.map
