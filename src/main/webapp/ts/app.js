/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="services.ts" />

var RouteState = {
    userList: 'users-list',
    usersEdit: 'users-edit',
    home: 'default'
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

var Users;
(function (Users) {
    function ListUsersCtrl($scope, gns, userService) {
        $scope.modalShown = false;
        $scope.template = "view/userslst.html";

        function setErrorMesg(response) {
            gns.growl.setMessage(response.error.message, GrowlBH.typeMessage.error);
        }

        userService.list().then(function (response) {
            $scope.state = 'list';
            $scope.users = response.body;
            $scope.$digest();
        }, function (response) {
            setErrorMesg(response);
        }, function (response) {
            setErrorMesg(response);
            gns.state.goto(RouteState.home);
        });

        if (!gns.growl.isMsgShowed())
            gns.growl.showGrowl();

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

    function UpdateUsersCtrl($scope, $stateParams, $q, gns) {
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
            if (isNull(response.error)) {
                gns.setMessage('Utilizador atualizado', GrowlBH.typeMessage.success);
                gns.goto(RouteState.userList);
            } else {
                gns.setMessage(response.error.message, GrowlBH.typeMessage.error);
                if (response.error.code === 401) {
                    gns.goto(RouteState.home);
                } else {
                    gns.showGrowl();
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

function DefaultCtrl($scope, $cookies, $location, gns) {
    if (gns.growl.isMsgShowed())
        gns.growl.showGrowl();
}

function AuthButtonCtrl($scope, $cookies, gns, $location, $rootScope) {
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
        gns.goto(RouteState.home);
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
//# sourceMappingURL=app.js.map
