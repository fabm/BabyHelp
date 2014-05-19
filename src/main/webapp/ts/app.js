/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="services.ts" />

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
    function ListUsersCtrl($scope, $growl, $state) {
        $scope.modalShown = false;
        $scope.template = "view/userslst.html";

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
                    growlMessage = response.error.message;
                    $state.go('default', null, { reload: true });
                }
            });
        });

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
    }
    Users.ListUsersCtrl = ListUsersCtrl;

    function UpdateUsersCtrl($scope, $state, $stateParams, $q) {
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
//# sourceMappingURL=app.js.map
