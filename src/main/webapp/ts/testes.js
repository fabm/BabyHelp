/// <reference path="def/testes.d.ts" />
/// <reference path="app.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var cbh = new ClientBabyHelp();
cbh.client = ("userBH");
var resToken;

var testes = {
    success: null,
    error: function (x) {
    },
    unauthorized: function (x) {
    },
    users: {
        list: function () {
        }
    },
    articles: {
        getService: function () {
            return null;
        },
        create: function () {
        },
        alterLast: function (order) {
        },
        list: function () {
        },
        delete: function (orders) {
        }
    },
    upload: function () {
    },
    loadClientPhotoToken: function (x) {
    }
};

function resolveThen(resolve) {
    resolve.then(function (success) {
        console.log('success:');
        console.log(success);
        testes.success = success;
    }, function (error) {
        console.log('error:');
        console.log(error);
        testes.error = error;
    }, function (unauthorized) {
        console.log('unauthorized:');
        console.log(unauthorized);
        testes.unauthorized;
    });
}

function injector(service) {
    return angular.element(document.body).injector().get(service);
}

testes.users.list = function loadTestUserService() {
    var userService = injector('userService');
    resolveThen(userService.list());
};

testes.articles.getService = function () {
    return injector('articleService');
};

testes.articles.create = function () {
    var articleService = testes.articles.getService();

    var newArticle = {
        'body': 'ola mundo',
        'summary': 'ola summary',
        'photoUrl': 'www.sapo.pt',
        'title': 'ola title'
    };

    resolveThen(articleService.create(newArticle));
};
testes.articles.alterLast = function (order) {
    var articleService = testes.articles.getService();

    var list = testes.success.body;
    var last = list[0];

    var updateArticle = {
        'id': last.id,
        'body': 'ola mundo mudado',
        'summary': 'ola summary mudado',
        'photoUrl': 'www.sapomudado.pt',
        'title': 'ola title mudado'
    };

    resolveThen(articleService.update(updateArticle));
};

testes.articles.list = function () {
    var articleService = testes.articles.getService();
    resolveThen(articleService.listMy());
};

testes.articles.delete = function (orders) {
    var ids = [];
    orders.forEach(function (value, index, arr) {
        ids.push(testes.success.body[value].id);
    });
    console.log('ids:');
    console.log(ids);
    resolveThen(testes.articles.getService().delete(ids));
};

testes.upload = function () {
    var appengineUplad = new AppEngineUpload();
    appengineUplad.processUrlSession();
    return appengineUplad;
};

testes.loadClientPhotoToken = function (callback) {
    var clientBabyHelp = new ClientBabyHelp();
    clientBabyHelp.client = 'photoToken';
    clientBabyHelp.loadApi(function (client) {
        callback(client);
    });
};

function InnerController($scope, $http, fUploadAppEngine) {
    var clientUrlTokenService = null;

    fUploadAppEngine.error = function (error) {
        alert(error);
    };
    fUploadAppEngine.success = function (success) {
        $scope.imagekey = success;
    };

    function loadResponse(response) {
        fUploadAppEngine.url = response.url;
        fUploadAppEngine.up($scope.upFile);
    }

    $scope.send = function () {
        if (clientUrlTokenService == null)
            testes.loadClientPhotoToken(function (client) {
                clientUrlTokenService = client;
                clientUrlTokenService.getuploadurl().execute(loadResponse);
            });
        else
            clientUrlTokenService.getuploadurl().execute(loadResponse);
    };
    // fim do teste de upload
}

function logThen(resolve, trace) {
    var cbSuccess = function (success) {
        console.log('success:');
        console.info(success);
        if (trace)
            console.trace();
    };
    var cbError = function (error) {
        console.log('error:');
        console.info(error);
        if (trace)
            console.trace();
    };
    var cbUnauthorized = function (unauthorized) {
        console.log('unauthorized:');
        console.info(unauthorized);
        if (trace)
            console.trace();
    };
    resolve.then(cbSuccess, cbError, cbUnauthorized);
}

var ArticleParamTest = (function () {
    function ArticleParamTest() {
        this.isPublic = true;
        this.body = 'bla bla body';
        this.summary = 'bla bla summary';
        this.title = 'bla, title';
        this.photoUrl = 'xxx';
    }
    return ArticleParamTest;
})();

var ApisHelper = (function (_super) {
    __extends(ApisHelper, _super);
    function ApisHelper() {
        _super.apply(this, arguments);
    }
    ApisHelper.getRoles = function () {
        var allRoles = UserService.loadAllRoles();
        var myRoles = {};
        for (var i in allRoles) {
            myRoles[allRoles[i].name] = allRoles[i].name;
        }
        return myRoles;
    };

    ApisHelper.prototype.loadTestes = function () {
        this.helpLoader('testes');
    };

    ApisHelper.prototype.loadArticle = function () {
        this.helpLoader('article');
    };
    return ApisHelper;
})(ClientBabyHelp);

var UserEntry = (function () {
    function UserEntry() {
        this.email = 'a@a.pt';
        this.roles = ['PARENT'];
        this.registered = false;
        this.logged = true;
        this.profession = null;
        this.loadFromDS = true;
    }
    return UserEntry;
})();

var apiTestes = {
    article: new ApisHelper(),
    user: new ApisHelper(),
    testes: new ApisHelper()
};

apiTestes.article.helpLoader('article');
apiTestes.user.helpLoader('userBH');
apiTestes.testes.helpLoader('testes');

apiTestes.article.afterLoad = function (name) {
    apiTestes.article.c['create'].args = new ArticleParamTest();
    console.log('loaded ' + name);
};
apiTestes['validations'] = {
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

apiTestes.testes.afterLoad = function (name) {
    apiTestes.testes.c['userEntry'].args = new UserEntry();
    var roles = ApisHelper.getRoles();

    var appRoles = {};
    for (var r in roles) {
        appRoles[r] = {
            name: r,
            add: function () {
                apiTestes.testes.c['userEntry'].args.roles.push(this.name);
            }
        };
        apiTestes.testes.c['userEntry'].appRoles = appRoles;
    }
    apiTestes.testes.c['userEntry'].appRoles.HEALTHTEC.add();
    apiTestes.testes.c['userEntry'].execute();

    console.log('loaded ' + name);
};
//# sourceMappingURL=testes.js.map
