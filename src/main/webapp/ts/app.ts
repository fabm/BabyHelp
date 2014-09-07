/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="services.ts" />
/// <reference path="testes.ts" />

interface ScopeUserList extends ng.IScope {
    showwait:boolean
    shownorowsnht:boolean
    shownhtcontent:boolean
    template:string
    state:any;
    removenht:(id:number)=>void
    users:any
    modalShown:boolean;
    toggleModal:Function;
    data:any;
    selectRole:(email:string, role:string, current:any)=>void;
    confirm:Function;
    addRole:Function;
    loading:boolean;
    loadingMessage:string;
}

interface ScopeMain extends ng.IScope {
    authvar:string;
    authaction:()=>void;
}

interface GrowlAndState {
    growl:GrowlBH;
    state:{
        goto:(state:string)=>void;
    }
}

var RouteState = {
    articleEdit: 'article-edit',
    userList: 'users-list',
    usersEdit: 'users-edit',
    home: 'default'
}


var shared = 0;

app.config(
    ($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider)=> {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state(RouteState.userList, {
                url: "/users",
                templateUrl: "views/usersmng/userslst.html",
                controller: Users.ListUsersCtrl
            })
            .state(RouteState.usersEdit, {
                url: "/users/edit/:email",
                templateUrl: "views/usersmng/usersup.html",
                controller: Users.UpdateUsersCtrl
            }).state(RouteState.articleEdit, {
                url: "/article/edit/:id",
                templateUrl: "views/artmng/articleedit.html",
                controller: Articles.EditArticleCtrl
            })
            .state(RouteState.home, {
                url: "/",
                templateUrl: "views/default.html",
                controller: DefaultCtrl
            })
    }
);

app.directive('modalDialog', function () {
    return {
        restrict: 'E',
        scope: {
            show: '=',
            data: '='
        },
        replace: true, // Replace with the template below
        transclude: true, // we want to insert custom content inside the directive
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


module Articles {
    var id:number = null;

    export function EditArticleCtrl($scope, $stateParams, gns:GrowlAndState, articleService:ArticlesService, fUploadAppEngine, photoTokenService) {

        if ($stateParams.id === '')
            id = $stateParams.id;
        $scope.create = id != null || $stateParams.id === '';

        function setErrorMessage(message) {
            gns.growl.setMessage(message, GrowlBH.typeMessage.error);
        }

        $scope.fileModelSetter = {
            upFile: (file)=> {
                $scope.upFileName = file.name;
            }
        };

        function loadId(callback:(success)=>void) {
            articleService.get(id).execute({
                success: callback, error: (response)=> {
                    setErrorMessage(response.error.message);
                    gns.growl.showGrowl();
                }, unauthorized: (response)=> {
                    setErrorMessage(response.message);
                    gns.state.goto(RouteState.home);
                }});
        }


        if ($scope.create) {
            $scope.article = {
                body: '',
                photoUrl: '',
                title: '',
                summary: ''
            }
        } else {
            loadId((success)=> {
                $scope.article = success;
            });
        }


        function upPhoto() {
            if ($scope.upFile) {
                photoTokenService.getPhotoToken().execute({
                    success: (response)=> {
                        fUploadAppEngine.success = (response) => {
                            gns.growl.setMessage("Atualizou o artigo com sucesso", GrowlBH.typeMessage.success);
                            gns.state.goto(RouteState.home);
                        }
                        fUploadAppEngine.error = (error) => {
                            setErrorMessage("Não foi possível fazer upload do ficheiro");
                            gns.growl.showGrowl();
                        }
                        fUploadAppEngine.url = response.url;
                        fUploadAppEngine.form.append('action', 'article-edit');
                        fUploadAppEngine.form.append('id', id);
                        fUploadAppEngine.up($scope.upFile);
                    }, error: (error)=> {
                        gns.growl.setMessage(error.error.message, GrowlBH.typeMessage.error);
                        gns.growl.showGrowl();
                    }, unauthorized: (unauthorized)=> {
                        gns.growl.setMessage(unauthorized.error.message, GrowlBH.typeMessage.error);
                        gns.state.goto(RouteState.home);
                    }
                });
            } else {
                gns.growl.setMessage("Atualizou o artigo com sucesso", GrowlBH.typeMessage.success);
                gns.state.goto(RouteState.home);
            }
        }


        $scope.save = function () {
            if ($scope.create) {
                articleService.create($scope.article).execute({
                    success: (success)=> {
                        gns.growl.setMessage(success.message, GrowlBH.typeMessage.success);
                        id = success.id;
                        upPhoto();
                    }, error: (response)=> {
                        setErrorMessage(response.error.message);
                        gns.growl.showGrowl();
                    }, unauthorized: (response)=> {
                        setErrorMessage(response.message);
                    }});
            } else {
                loadId((success)=> {
                    $scope.article = success;
                    id = null;
                });
            }
        }

        $scope.cancel = function () {
            gns.state.goto(RouteState.home);
        }

        $scope.buttonLabel = function () {
            if ($scope.create) return 'criar';
            else return 'atualizar';
        }
    }

    export function ListArticles($scope, gns:GrowlAndState) {
        //TODO alterar para ver artigos
        $scope.showArticles = function () {
            return true;
        }

        $scope.loading = "A carregar artigos...";

        $scope.hasHTRole = false;


    }
}

module Users {

    export function ListUsersCtrl($scope:ScopeUserList, gns:GrowlAndState, userService:UserService) {
        $scope.modalShown = false;
        $scope.loading = true;
        $scope.loadingMessage = localeMessage('loadingData','loading data ...');

        function setErrorMesg(response) {
            gns.growl.setMessage(response, GrowlBH.typeMessage.error);
        }

        userService.loadApi(()=> {
            userService.list().execute({
                success: (response)=> {
                    $scope.state = 'list';
                    $scope.users = response.body;
                    $scope.loading = false;
                    $scope.$digest();
                },
                error: (response)=> {
                    $scope.loading = false;
                    setErrorMesg(response);
                },
                unauthorized: (response)=> {
                    $scope.loading = false;
                    setErrorMesg(response);
                    gns.state.goto(RouteState.home);
                }
            });
        });


        if (!gns.growl.isMsgShowed())
            gns.growl.showGrowl();

        $scope['showUsersList'] = ()=> {
            switch ($scope.state) {
                case 'confirmDelete':
                case 'list':
                    return true;
                default :
                    return false;
            }
        }
    }

    export function UpdateUsersCtrl($scope, $stateParams, $q:ng.IQService, gns:GrowlAndState, userService:UserService) {
        var user:any = {email: null};

        function setErrorMessage(response) {
            gns.growl.setMessage(response, GrowlBH.typeMessage.error);
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
            userService.getRoles(user).execute({
                success: (response)
                    => {
                    resetLoading();
                    $scope.$digest();
                },
                error: (response)=> {
                    resetLoading();
                    setErrorMessage(response)
                    gns.growl.showGrowl();
                }, unauthorized: (response)=> {
                    resetLoading();
                    setErrorMessage(response);
                    gns.state.goto(RouteState.home);
                }
            });
        }

        $scope.user = user;
        $scope.save = () => {
            userService.loadApi(()=> {
                userService.updateRoles($scope.user).execute({
                    success: (response)=> {
                        gns.growl.setMessage('Utilizador atualizado',
                            GrowlBH.typeMessage.success);
                        gns.state.goto(RouteState.userList);
                    },
                    error: (response)=> {
                        setErrorMessage(response);
                        gns.growl.showGrowl();

                    }, unauthorized: (response)=> {
                        setErrorMessage(response);
                        gns.state.goto(RouteState.userList);
                    }
                });
            });
        }
        $scope.buttonLabel = () => {
            if ($scope.create) return 'criar';
            else return 'atualizar';
        }

        $scope.cancel = ()=> {
            gns.state.goto(RouteState.userList);
        }
    }
}

interface AuthButtonCtrlScope extends ng.IScope {
    state:boolean;
    logout:()=>void;
    login:()=>void;
    update:()=>void;
    authvar:string;
    $location:ng.ILocationService;
    authaction:()=>void;
}

function DefaultCtrl($scope, $cookies, $location, gns:GrowlAndState) {
    if (!gns.growl.isMsgShowed())
        gns.growl.showGrowl();
    $scope.goToUsers = ()=> {
        gns.state.goto(RouteState.userList);
    }
}

function AuthButtonCtrl($scope:AuthButtonCtrlScope, $cookies, gns, $location, $rootScope) {
    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            update(false);
        }
    );

    var bh = new ClientBabyHelp();

    $scope.authaction = ()=> {
        if (ClientLoader.logged) {
            $scope.logout();
        } else {
            $scope.login();
        }
    }

    $scope.logout = () => {
        ClientLoader.logout();
        gns.state.goto(RouteState.home);
    }
    $scope.login = () => {
        bh.login(()=> {
            if (ClientLoader.logged)
                update(true);
        });
    }

    var update = (apply:boolean)=> {
        $scope.state = ClientLoader.logged;
        $scope.authvar = $scope.state ? "logout" : "login";
        if (apply)
            $scope.$digest();
    }
    update(false);
}


app.controller(['AuthButtonCtrl', AuthButtonCtrl]);

