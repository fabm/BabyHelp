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


module Users {

    export function ListUsersCtrl($scope:ScopeUserList, gns:GrowlAndState, userService:UserService) {
        $scope.modalShown = false;
        $scope.template = "view/userslst.html";


        function setErrorMesg(response) {
            gns.growl.setMessage(response.error.message, GrowlBH.typeMessage.error);
        }

        userService.list().then(
            (response)=> {
                $scope.state = 'list';
                $scope.users = response.body;
                $scope.$digest();
            },
            (response)=> {
                setErrorMesg(response);
            },
            (response)=> {
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

    export function UpdateUsersCtrl($scope, $stateParams, $q:ng.IQService, gns) {
        var user:any = {email: null};

        function loadClient(callback:()=>void) {
            if (!Api.isClientLoaded(Api.ApiClient.userBH)) {
                $scope.loading = 'A autenticar...';
                Api.auth((state:Api.ApiState)=> {
                    $scope.loading = 'A carregar cliente...';
                    $scope.$digest();
                    Api.loadClient(Api.ApiClient.userBH, ()=> {
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
            loadClient(()=> {
                Api.User.getRoles(user).execute(()=> {
                    $scope.$digest();
                });
            });
        }

        $stateParams.email
        var scopeEdit = $scope;

        function updated(response) {
            if (isNull(response.error)) {
                gns.setMessage('Utilizador atualizado', GrowlBH.typeMessage.success);
                gns.goto(RouteState.userList);
            } else {
                gns.setMessage(response.error.message, GrowlBH.typeMessage.error);
                if (response.error.code === 401) {
                    gns.goto(RouteState.home);
                }
                else {
                    gns.showGrowl();
                }
            }
        }


        scopeEdit.user = user;

        $scope.save = () => {
            loadClient(()=> {
                Api.User.updateRoles(user).execute(updated);
            });
        }
    }
}


class DefaultViewCtrl {
    $scope:ng.IScope;

    constructor($scope) {
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
}

function AuthButtonCtrl($scope:AuthButtonCtrlScope, $cookies, gns, $location, $rootScope) {
    $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
            update(false);
        });

    if (!isNull($cookies.logged)) {
        Api.logged = $cookies.logged;
    }
    var apiAuthCallback = (state:Api.ApiState)=> {
        $scope.state = Api.logged;
        $cookies.logged = Api.logged;
        update(true);
    }

    $scope.authaction = ()=> {
        if (Api.logged) {
            $scope.logout();
        } else {
            $scope.login();
        }
    }

    if (window.location.hostname !== 'localhost') {
        Api.auth(apiAuthCallback);
    }

    $scope.logout = () => {
        Api.logout();
        $scope.state = $cookies.logged = Api.logged;
        gns.goto(RouteState.home);
    }
    $scope.login = () => {
        Api.login(apiAuthCallback);
    }

    $scope.state = Api.logged;

    var update = (apply:boolean)=> {
        var scope = $scope;
        scope.authvar = $scope.state ? "logout" : "login";
        if (apply)
            scope.$digest();
    }
    update(false);
}


app.controller(['AuthButtonCtrl', AuthButtonCtrl]);


