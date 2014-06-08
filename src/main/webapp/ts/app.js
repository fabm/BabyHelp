/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="services.ts" />
/// <reference path="testes.ts" />

var RouteState = {
    articleEdit: 'article-edit',
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
    }).state(RouteState.articleEdit, {
        url: "/article/edit/:id",
        templateUrl: "views/artmng/articleedit.html",
        controller: Articles.EditArticleCtrl
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

var Articles;
(function (Articles) {
    var id = null;

    function EditArticleCtrl($scope, $stateParams, gns, articleService, fUploadAppEngine, photoTokenService) {
        if ($stateParams.id === '')
            id = $stateParams.id;
        $scope.create = id != null || $stateParams.id === '';

        function setErrorMessage(message) {
            gns.growl.setMessage(message, GrowlBH.typeMessage.error);
        }

        function loadId(callback) {
            articleService.get(id).then(callback, function (error) {
                setErrorMessage(error.message);
                gns.growl.showGrowl();
            }, function (unauthorized) {
                setErrorMessage(unauthorized.message);
            });
        }

        if ($scope.create) {
            $scope.article = {
                body: '',
                photoUrl: '',
                title: '',
                summary: ''
            };
        } else {
            loadId(function (success) {
                $scope.article = success;
            });
        }

        function upPhoto() {
            photoTokenService.getPhotoToken().then(function (success) {
                fUploadAppEngine.success = function (success) {
                    console.log('ficheiro inserido com sucesso:');
                    console.log(success);
                };
                fUploadAppEngine.error = function (error) {
                    setErrorMessage("Não foi possível fazer upload do ficheiro");
                    gns.growl.showGrowl();
                };
                fUploadAppEngine.url = success.url;
                fUploadAppEngine.form.append('action', 'article-edit');
                fUploadAppEngine.form.append('id', id);
                fUploadAppEngine.up($scope.upFile);
            }, function (error) {
                gns.growl.setMessage;
            }, function (unauthorized) {
                console.log('sem autorização');
            });
        }

        $scope.save = function () {
            if ($scope.create) {
                articleService.create($scope.article).then(function (success) {
                    gns.growl.setMessage(success.message, GrowlBH.typeMessage.success);
                    id = success.id;
                    upPhoto();
                }, function (error) {
                    setErrorMessage(error.message);
                    gns.growl.showGrowl();
                }, function (unauthorized) {
                    setErrorMessage(unauthorized.message);
                });
            } else {
                loadId(function (success) {
                    $scope.article = success;
                    id = null;
                });
            }
        };

        $scope.buttonLabel = function () {
            if ($scope.create)
                return 'criar';
            else
                return 'atualizar';
        };
    }
    Articles.EditArticleCtrl = EditArticleCtrl;

    function ListArticles($scope, gns) {
    }
    Articles.ListArticles = ListArticles;
})(Articles || (Articles = {}));

var Users;
(function (Users) {
    function ListUsersCtrl($scope, gns, userService) {
        $scope.modalShown = false;
        $scope.loading = 'a carragar dados...';

        function resetLoading() {
            delete $scope.loading;
        }

        function setErrorMesg(response) {
            gns.growl.setMessage(response.error.message, GrowlBH.typeMessage.error);
        }

        userService.list().then(function (response) {
            $scope.state = 'list';
            $scope.users = response.body;
            resetLoading();
            $scope.$digest();
        }, function (response) {
            resetLoading();
            setErrorMesg(response);
        }, function (response) {
            resetLoading();
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

    function UpdateUsersCtrl($scope, $stateParams, $q, gns, userService) {
        var user = { email: null };

        function setErrorMessage(response) {
            gns.growl.setMessage(response.error.message, GrowlBH.typeMessage.error);
        }

        $scope.create = $stateParams.email === '';
        $scope.loading = 'a carregar dados...';

        function resetLoading() {
            delete $scope.loading;
        }

        if ($scope.create) {
            user.roles = UserService.loadAllRoles();
            resetLoading();
        } else {
            user.email = $stateParams.email;
            $scope.user = user;
            userService.getRoles(user).then(function (response) {
                resetLoading();
                $scope.$digest();
            }, function (response) {
                resetLoading();
                setErrorMessage(response);
                gns.growl.showGrowl();
            }, function (response) {
                resetLoading();
                setErrorMessage(response);
                gns.state.goto(RouteState.home);
            });
        }

        $scope.user = user;
        $scope.save = function () {
            userService.updateRoles($scope.user).then(function (success) {
                gns.growl.setMessage('Utilizador atualizado', GrowlBH.typeMessage.success);
                gns.state.goto(RouteState.userList);
            }, function (error) {
                setErrorMessage(error);
                gns.growl.showGrowl();
            }, function (unauthorized) {
                setErrorMessage(unauthorized);
                gns.state.goto(RouteState.userList);
            });
        };
        $scope.buttonLabel = function () {
            if ($scope.create)
                return 'criar';
            else
                return 'atualizar';
        };

        $scope.cancel = function () {
            gns.state.goto(RouteState.userList);
        };
    }
    Users.UpdateUsersCtrl = UpdateUsersCtrl;
})(Users || (Users = {}));

function DefaultCtrl($scope, $cookies, $location, gns) {
    if (gns.growl.isMsgShowed())
        gns.growl.showGrowl();
    $scope.goToUsers = function () {
        gns.state.goto(RouteState.userList);
    };
}

function AuthButtonCtrl($scope, $cookies, gns, $location, $rootScope) {
    $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
        update(false);
    });

    var bh = new ClientBabyHelp();

    $scope.authaction = function () {
        if (ClientLoader.logged) {
            $scope.logout();
        } else {
            $scope.login();
        }
    };

    $scope.logout = function () {
        ClientLoader.logout();
        gns.goto(RouteState.home);
    };
    $scope.login = function () {
        bh.login(function () {
            if (ClientLoader.logged)
                update(true);
        });
    };

    $scope.state = ClientLoader.logged;

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
