/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="services.ts" />

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
    loading:string;
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
    userList: 'users-list',
    usersEdit: 'users-edit',
    home: 'default'
}

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
    export function EditArticleCtrl($scope, gns:GrowlAndState) {
    }

    export function ListArticles($scope, gns:GrowlAndState) {

    }
}

module Users {

    export function ListUsersCtrl($scope:ScopeUserList, gns:GrowlAndState, userService:UserService) {
        $scope.modalShown = false;
        $scope.loading = 'a carragar dados...';

        function resetLoading() {
            delete $scope.loading;
        }

        function setErrorMesg(response) {
            gns.growl.setMessage(response.error.message, GrowlBH.typeMessage.error);
        }

        userService.list().then(
            (response)=> {
                $scope.state = 'list';
                $scope.users = response.body;
                resetLoading();
                $scope.$digest();
            },
            (response)=> {
                resetLoading();
                setErrorMesg(response);
            },
            (response)=> {
                resetLoading();
                setErrorMesg(response);
                gns.state.goto(RouteState.home);
            }
        );

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
            gns.growl.setMessage(response.error.message, GrowlBH.typeMessage.error);
        }

        $scope.create = $stateParams.email === '';
        $scope.loading = 'a carregar dados...';

        function resetLoading() {
            delete $scope.loading;
        }

        if ($scope.create) {
            userService.getRoles(user);
        } else {
            user.email = $stateParams.email;
            $scope.user = user;
            userService.getRoles(user).then(
                (response)=> {
                    resetLoading();
                    $scope.$digest();
                }, (response)=> {
                    resetLoading();
                    setErrorMessage(response)
                    gns.growl.showGrowl();
                }, (response)=> {
                    resetLoading();
                    setErrorMessage(response);
                    gns.state.goto(RouteState.home);
                }
            );
        }

        $scope.save = () => {
            userService.updateRoles($scope.user).then(
                (response)=> {
                    gns.growl.setMessage('Utilizador atualizado',
                        GrowlBH.typeMessage.success);
                    gns.state.goto(RouteState.userList);
                }, (response)=> {
                    setErrorMessage(response);
                    gns.growl.showGrowl();

                }, (response)=> {
                    setErrorMessage(response);
                    gns.state.goto(RouteState.userList);
                }
            );
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
    if (gns.growl.isMsgShowed())
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
        gns.goto(RouteState.home);
    }
    $scope.login = () => {
        bh.login(()=>{
            if(ClientLoader.logged)
            update(true);
        });
    }

    $scope.state = ClientLoader.logged;

    var update = (apply:boolean)=> {
        var scope = $scope;
        scope.authvar = $scope.state ? "logout" : "login";
        if (apply)
            scope.$digest();
    }
    update(false);
}


app.controller(['AuthButtonCtrl', AuthButtonCtrl]);


