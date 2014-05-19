/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="services.ts" />


interface Growl {
    box:(title:string, content:string, options:{class:string;sticky:boolean;timeout:number})
        =>{open:()=>void};
}

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


app.config(
    ($stateProvider:ng.ui.IStateProvider, $urlRouterProvider:ng.ui.IUrlRouterProvider)=> {
        $urlRouterProvider.otherwise("/");

        $stateProvider
            .state('users-list', {
                url: "/users",
                templateUrl: "views/usersmng/userslst.html",
                controller: Users.ListUsersCtrl
            })
            .state('users-edit', {
                url: "/users/edit/:email",
                templateUrl: "views/usersmng/usersup.html",
                controller: Users.UpdateUsersCtrl
            })
            .state('default', {
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

var growlMessage:string = null;

module Users {


    export function ListUsersCtrl($scope:ScopeUserList, $growl:Growl, $state) {
        $scope.modalShown = false;
        $scope.template = "view/userslst.html";


        function loadClient(callback:()=>void) {
            if (!Api.isClientLoaded(Api.ApiClient.userBH)) {
                Api.loadClient(Api.ApiClient.userBH, callback);
            } else {
                callback();
            }
        }

        loadClient(()=> {
            Api.User.list().execute((response)=> {
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

    export function UpdateUsersCtrl($scope, $state, $stateParams, $q:ng.IQService) {
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
            growlMessage = 'Updated user';
            $state.go('users-list', null, { reload: true });
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


function DefaultCtrl($scope, $cookies, $state, $location, $growl:Growl) {
    if (growlMessage != null) {
        $growl.box('Erro', growlMessage, {
            class: 'danger', sticky: false, timeout: 3000
        }).open();
        growlMessage = null;
    }
}

function AuthButtonCtrl($scope:AuthButtonCtrlScope, $cookies, $state, $location, $rootScope) {
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
        $state.go('default', null, { reload: true });
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

class Params {
    path:string;
    method:string = 'GET';
    callback = Log.cbr;
}