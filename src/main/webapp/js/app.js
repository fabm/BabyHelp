var Babyhelp = function () {
    "use strict";
    var self = this;
    var apiroot = window.location.origin + "/_ah/api";
    var scopes = 'https://www.googleapis.com/auth/userinfo.email';
    var clientId = '942158003504-a3lbkisacvpnafpom0btj9nn41k8td0f.apps.googleusercontent.com';
    var apiCount = 2;
    var logged = false;
    var callbackSign;
    this.$scope;


    function mainFlux() {

    }

    function loaded() {
        self.signin(function (r) {
            logged = r.code != undefined;
            callbackSign(r.code != undefined);
        });
    }

    this.setCalbackSign = function (calback) {
        self.callbackSign = calback;
    }

    /**
     * @returns boolean
     */
    function isLocal() {
        return window.location.hostname == 'localhost';
    }

    var localAuth = {
        login: 'login',
        logout: 'logout',
        action: function (part) {
            window.location.href =
                window.location.origin + '/_ah/' + part + '?continue=' + encodeURIComponent(window.location.pathname);
        },
        isLocalVar: undefined,
        isLocal: function () {
            if (localAuth.isLocalVar == undefined)
                localAuth.isLocalVar = window.location.hostname == 'localhost';
            return localAuth.isLocalVar;
        }
    }


    function loading() {
        if (--apiCount == 0) {
            loaded();
        }
    }

    this.loginLocal = function () {
        localAuth.action(localAuth.login);
    }


    this.authLoaded = function () {
        states.auth = true;
    }

    this.signin = function () {
        if (gapi.client.oauth2 == undefined) {
            return gapi.client.load('oauth2', 'v2', self.signin);
        }

        gapi.auth.authorize({client_id: clientId,
                scope: scopes, immediate: false},
            function (r) {
                logged = r.code == undefined;
                if (!logged && localAuth.isLocal()) {
                    localAuth.action(localAuth.login);
                } else
                    callbackSign(logged);
            });
    }
    this.test = function (callback) {
        if (gapi.client.testEndpoint == undefined) {
            return gapi.client.load('testEndpoint', 'v1', function () {
                self.test(callback);
            }, apiroot);
        }
        gapi.client.testEndpoint.testEndPoint.testObject().execute(function (r) {
            callback(r);
        });
    }
};

function LocalTest() {
    "use strict";
    var apiroot = window.location.origin + "/_ah/api";

    this.apis = {
        test: 'testEndpoint',
        userFromApp: 'userFromApp',
        nextHT: 'nextht'
    }

    this.loadGapi = function (api) {
        gapi.client.load(api, 'v1', function (resp) {
            console.log('loaded api ' + api);
        }, apiroot);
    }

    this.exec = function (executer) {
        executer.execute(function (resp) {
            console.log(resp);
        });
    }
}

var test = new LocalTest();

var babyHelp;


/**
 * @param callback
 * @returns Babyhelp
 */
function getBabyHelp(callback) {
    if (babyHelp == undefined) {
        babyHelp = new Babyhelp(callback);
    }
    return babyHelp;
}


function callMethod(method) {
    "use strict";
    method(function (r) {
        console.info(r);
    });
}

function signout(callback) {
    "use strict";
    gapi.auth.setToken(null);
    if (callback != undefined) {
        callback('logged out');
    }
}

angular.module('babyhelp', [])
    .controller('MainCtrl', function ($scope, $window) {

        gapi.load('auth', function () {
            "use strict";

            if (gapi.auth.getToken() == null) {
                console.log('nulo');
            } else {
                getBabyHelp().test(function (r) {
                    console.info(r);
                });
            }
        });

        getBabyHelp(function (isLogged) {
            if (isLogged) {
                $scope.authvar == 'login';
            } else {
                $scope.authvar = 'logout';
            }
        });

        $scope.authvar = 'login';

        $window.init = function () {
            $scope.$apply($scope.load_guestbook_lib);
        };

        $scope.login = function () {
            "use strict";
            if ($scope.authvar == 'login') {
                if (window.location.hostname == 'localhost') {
                } else {
                }
                signin(function (r) {
                    $scope.$apply(function (r) {
                        $scope.authvar = 'logout';
                        loadTest(function (r) {
                            console.log(r);
                        });
                    });
                });
            } else {
                gapi.auth.setToken(null);
                $scope.authvar = 'login';
            }
        }

        $scope.load_guestbook_lib = function () {
            gapi.client.load('nextht', 'v1', function () {
                $scope.is_backend_ready = true;
                $scope.list();
            }, '/_ah/api');
        };

        $scope.list = function () {
            gapi.client.guestbook.messages.list().execute(function (resp) {
                $scope.messages = resp.items;
                $scope.$apply();
            });
        }

    })
    .controller('ContentCtrl', function ($scope) {
        $scope.naomi = {
            name: 'Naomi',
            address: '1600 Amphitheatre'
        };
        $scope.temp = 'x.html';
        $scope.k = 'valor de k';
    })
    .directive('myCustomer', function () {
        return {
            restrict: 'E',
            scope: {
                customerInfo: '=info'
            },
            templateUrl: 'my-cust.html'
        };
    });