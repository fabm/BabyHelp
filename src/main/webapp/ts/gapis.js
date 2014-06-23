/// <reference path="ext/gapi/gapi.d.ts" />
/// <reference path="lib.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};

var StateLoading;
(function (StateLoading) {
    StateLoading[StateLoading["loadingGAPI"] = 0] = "loadingGAPI";
    StateLoading[StateLoading["authenticating"] = 1] = "authenticating";
    StateLoading[StateLoading["clientLoading"] = 2] = "clientLoading";
    StateLoading[StateLoading["callService"] = 3] = "callService";
    StateLoading[StateLoading["authFail"] = 4] = "authFail";
})(StateLoading || (StateLoading = {}));

var ClientLoader = (function () {
    function ClientLoader() {
        var _this = this;
        this.version = 'v1';
        this.config = {};
        this.defaultResolver = {
            success: function (success) {
                console.log(success);
            },
            error: function (error) {
                console.log(error);
            },
            unauthorized: function (unauthorized) {
                console.log(unauthorized);
            }
        };
        this.getAuthConfig = function (immediate) {
            _this.config['immediate'] = immediate;

            if (!immediate) {
                _this.config['approval_prompt'] = 'force';
            }
            return _this.config;
        };
        this.afterLoad = function () {
            console.log('loaded ' + this.client);
        };
    }
    ClientLoader.logout = function () {
        gapi.auth.setToken(null);
        this.logged = false;
    };

    ClientLoader.prototype.login = function (callback) {
        this.checkAuth(false, callback);
    };

    ClientLoader.prototype.setClientID = function (clientID) {
        this.config['client_id'] = clientID;
    };

    ClientLoader.prototype.setScope = function (scope) {
        this.config['scope'] = scope;
    };

    ClientLoader.prototype.checkAuth = function (immediate, callback) {
        var self = this;
        gapi.auth.authorize(self.getAuthConfig(immediate), function (response) {
            if (response.error) {
                ClientLoader.logged = false;
            } else {
                ClientLoader.logged = true;
            }
            callback();
        });
    };

    ClientLoader.prototype.callCBState = function (state) {
        if (this.cbState != null)
            this.cbState(state);
    };

    ClientLoader.prototype.loadApi = function (callback) {
        var self = this;

        if (isNull(gapi.auth)) {
            self.callCBState(0 /* loadingGAPI */);
            gapi.load('auth', function () {
                self.callCBState(1 /* authenticating */);
                self.loadApi(callback);
            });
        } else if (self.requireAuth && !ClientLoader.logged)
            self.checkAuth(true, function () {
                if (ClientLoader.logged) {
                    self.callCBState(2 /* clientLoading */);
                    self.loadApi(callback);
                } else {
                    self.callCBState(4 /* authFail */);
                }
            });
        else if (isNull(gapi.client[self.client])) {
            gapi.client.load(self.client, self.version, function () {
                self.api = {};
                self.attribClient(gapi.client[self.client], self.api);
                self.callCBState(3 /* callService */);
                if (!isNull(callback))
                    callback();
            }, self.apiUrl);
        }
    };

    ClientLoader.prototype.attribClient = function (client, context) {
        var obSelf = this;
        for (var m in client) {
            if (typeof (client[m]) === 'function')
                context[m] = {
                    args: undefined,
                    mName: m,
                    argsEval: function () {
                        var self = this;
                        client[this.mName]({ 'eval': true }).execute(function (response) {
                            var result = response.result;
                            self.args = {};
                            self['validations'] = {};
                            self['alias'] = {};
                            for (var r in result) {
                                var type = result[r]['type'];
                                var validations = result[r]['validations'];
                                var al = result[r]['alias'];
                                if (!isNull(validations))
                                    self['validations'][r] = validations;
                                if (!isNull(al))
                                    self['alias'][r] = al;
                                if (type === 'String') {
                                    self.args[r] = '';
                                } else if (type === 'List') {
                                    self.args[r] = [];
                                } else if (type === 'boolean') {
                                    self.args[r] = true;
                                }
                            }
                            self.response = response.result;
                        });
                    },
                    execute: function (resolver) {
                        var self = this;
                        if (isNull(resolver))
                            resolver = self.defaultResolver;

                        function getValidation(name, value) {
                            var valArr = self['validations'][name];
                            if (!isNull(valArr))
                                for (var val in valArr) {
                                    if (!obSelf['validations'][valArr[val]].check(value)) {
                                        var al = self['alias'][name];
                                        al = (al == undefined) ? name : al;
                                        resolver.error({ error: {
                                                message: obSelf['validations'][valArr[val]].alert(al)
                                            } });
                                        return;
                                    }
                                }
                        }

                        if (!isNull(self.args) && !isNull(self['validations']))
                            for (var p in self.validations) {
                                var ret = getValidation(p, self.args[p]);
                            }

                        client[this.mName](self.args).execute(function (response) {
                            if (isNull(response.code)) {
                                resolver.success(response.result);
                            } else if (response.code == 401) {
                                resolver.unauthorized(response.error.message);
                            } else {
                                resolver.error(response.error);
                            }
                        });
                    }
                };
            else {
                context[m] = {};
                obSelf.attribClient(client[m], context[m]);
            }
        }
    };

    ClientLoader.prototype.helpLoader = function (name) {
        this.client = name;
        this.loadApi();
    };
    ClientLoader.logged = false;
    return ClientLoader;
})();

var ClientBabyHelp = (function (_super) {
    __extends(ClientBabyHelp, _super);
    function ClientBabyHelp() {
        _super.call(this);
        this.validations = {
            EMAIL: {
                check: function (value) {
                    return /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(value);
                },
                alert: function (alias) {
                    return "O campo " + alias + " não é reconhecido como email";
                }
            },
            REQUIRED: {
                check: function (value) {
                    if (isNull(value))
                        return false;
                    if (value.length == 0)
                        return false;
                    return true;
                },
                alert: function (alias) {
                    return "O campo " + alias + " não pode ser vazio";
                }
            }
        };
        this.apiUrl = 'http' + (isLocal ? '' : 's') + '://' + window.location.host + "/_ah/api";
        _super.prototype.setClientID.call(this, '942158003504-3c2sv8q1ukhneffl2sfl1mm9g8ac281u.apps.googleusercontent.com');
        _super.prototype.setScope.call(this, ['https://www.googleapis.com/auth/userinfo.email']);
    }
    return ClientBabyHelp;
})(ClientLoader);

var UserService = (function (_super) {
    __extends(UserService, _super);
    function UserService() {
        _super.call(this);
        this.client = 'userBH';
    }
    UserService.loadAllRoles = function () {
        function create(alias, name) {
            return {
                name: name,
                alias: alias,
                role: false
            };
        }

        var all = [];
        all.push(create('técnico de saúde', 'HEALTHTEC'));
        all.push(create('administrador', 'ADMINISTRATOR'));
        all.push(create('educador', 'PARENT'));
        return all;
    };

    UserService.prototype.getRoles = function (user) {
        var _this = this;
        var self = this;

        var onSuccess;

        var iResolver = {
            success: function (response) {
                var allRoles = UserService.loadAllRoles();
                allRoles.forEach(function (value, index, arr) {
                    value.role = response.body.indexOf(value.name) != -1;
                });
                user.roles = allRoles;
                onSuccess(null);
            },
            error: null,
            unauthorized: null
        };

        return {
            execute: function (resolver) {
                iResolver.error = resolver.error;
                iResolver.unauthorized = resolver.unauthorized;
                onSuccess = resolver.success;
                _super.prototype.loadApi.call(_this, function () {
                    self.api['getRoles']({ email: user.email }).execute(iResolver);
                });
            }
        };
    };

    UserService.prototype.updateRoles = function (user) {
        var self = this;

        return {
            execute: function (resolver) {
                var rolesSelected = [];
                user.roles.forEach(function (value, index, arr) {
                    if (value.role)
                        rolesSelected.push(value.name);
                });

                self.api['updateRoles']({ 'email': user.email, 'roles': rolesSelected }).execute(resolver);
            }
        };
    };
    return UserService;
})(ClientBabyHelp);

var ArticlesService = (function (_super) {
    __extends(ArticlesService, _super);
    function ArticlesService() {
        _super.call(this);
        this.client = 'article';
    }
    ArticlesService.prototype.get = function (id) {
        return _super.prototype.load.call(this, function (client) {
            return client.get({ id: id });
        });
    };

    ArticlesService.prototype.create = function (article) {
        return _super.prototype.load.call(this, function (client) {
            return client.create(article);
        });
    };

    ArticlesService.prototype.listMy = function () {
        return _super.prototype.load.call(this, function (client) {
            return client.list.my();
        });
    };

    ArticlesService.prototype.listPublic = function () {
        return _super.prototype.load.call(this, function (client) {
            return client.list.public();
        });
    };

    ArticlesService.prototype.update = function (article) {
        return _super.prototype.load.call(this, function (client) {
            return client.update(article);
        });
    };

    ArticlesService.prototype.delete = function (ids) {
        return _super.prototype.load.call(this, function (client) {
            return client.delete({ ids: ids });
        });
    };
    return ArticlesService;
})(ClientBabyHelp);

var PhotoTokenService = (function (_super) {
    __extends(PhotoTokenService, _super);
    function PhotoTokenService() {
        _super.call(this);
        this.client = 'photoToken';
    }
    PhotoTokenService.prototype.getPhotoToken = function () {
        return this.load(function (client) {
            return client.getuploadurl();
        });
    };
    return PhotoTokenService;
})(ClientBabyHelp);
//# sourceMappingURL=gapis.js.map
