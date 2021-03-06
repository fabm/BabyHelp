/// <reference path="def/testes.d.ts" />
/// <reference path="app.ts" />

var testes = {
    success: null,
    error: (x)=> {
    },
    unauthorized: (x)=> {
    },
    users: {
        list: ()=> {
        }
    },
    articles: {
        getService: ()=> {
            return null;
        },
        create: ()=> {
        },
        alterLast: (order:number)=> {
        },
        list: ()=> {
        },
        delete: (orders)=> {
        }
    },
    upload: ()=> {
    },
    loadClientPhotoToken: (x)=> {
    }
};

function resolveThen(resolve) {
    resolve.then(
        function (success) {
            console.log('success:');
            console.log(success);
            testes.success = success;
        }, function (error) {
            console.log('error:');
            console.log(error);
            testes.error = error;
        },
        function (unauthorized) {
            console.log('unauthorized:');
            console.log(unauthorized);
            testes.unauthorized;
        }
    );
}

function injector(service) {
    return angular.element(document.body).injector().get(service);
}


testes.users.list = function loadTestUserService() {
    var userService = injector('userService');
    resolveThen(userService.list());
}

testes.articles.getService = function () {
    return injector('articleService');
}

testes.articles.create = function () {
    var articleService = testes.articles.getService();

    var newArticle = {
        'body': 'ola mundo',
        'summary': 'ola summary',
        'photoUrl': 'www.sapo.pt',
        'title': 'ola title'
    };

    resolveThen(articleService.create(newArticle));
}
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
}

testes.articles.list = function () {
    var articleService = testes.articles.getService();
    resolveThen(articleService.listMy());
}

testes.articles.delete = function (orders:Array<number>) {
    var ids = [];
    orders.forEach(function (value, index, arr) {
        ids.push(testes.success.body[value].id);
    });
    console.log('ids:');
    console.log(ids);
    resolveThen(testes.articles.getService().delete(ids));
}

testes.upload = function () {
    var appengineUplad = new AppEngineUpload();
    appengineUplad.processUrlSession();
    return appengineUplad;
}


testes.loadClientPhotoToken = function (callback) {
    var clientBabyHelp = new ClientBabyHelp(null);
    clientBabyHelp.client = 'photoToken';
    clientBabyHelp.loadApi(callback);
}

function InnerController($scope, $http, fUploadAppEngine) {
    var clientUrlTokenService = null;

    fUploadAppEngine.error = function (error) {
        alert(error);
    }
    fUploadAppEngine.success = function (success) {
        $scope.imagekey = success;
    }

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
    }

    // fim do teste de upload

}

class ArticleParamTest implements ArticleCreation {
    isPublic:boolean = true;
    body:string = 'bla bla body';
    summary:string = 'bla bla summary';
    title:string = 'bla, title';
    photoUrl:string = 'xxx';
}

class ApisHelper extends ClientBabyHelp {


    static getRoles() {
        var allRoles = UserService.loadAllRoles();
        var myRoles = {};
        for (var i in allRoles) {
            myRoles[allRoles[i].name] = allRoles[i].name;
        }
        return myRoles;
    }



    public loadTestes() {
        this.helpLoader('testes');
    }

    public loadArticle() {
        this.helpLoader('article');
    }

}

class UserEntry {
    email:string = 'a@a.pt';
    roles:Array<string> = ['PARENT'];
    registered:boolean = false;
    logged:boolean = true;
    profession:string = null;
    loadFromDS:boolean = true;

}

var apiTestes = {
    article: new ApisHelper(null),
    user: new ApisHelper(null),
    testes: new ApisHelper(null)
}

apiTestes.article.helpLoader('article');
apiTestes.user.helpLoader('userBH');
apiTestes.testes.helpLoader('testes');

apiTestes.article.afterLoad = function () {
    apiTestes.article.api['create'].args = new ArticleParamTest();
    console.log('loaded ' + this.client);
}

apiTestes.testes.afterLoad = function () {
    apiTestes.testes.api['userEntry'].args = new UserEntry();
    var roles = ApisHelper.getRoles();

    var appRoles = {};
    for (var r in roles) {
        appRoles[r] = {
            name: r,
            add: function () {
                apiTestes.testes.api['userEntry'].args.roles.push(this.name);
            }
        };
        apiTestes.testes.api['userEntry'].appRoles = appRoles;
    }
    apiTestes.testes.api['userEntry'].appRoles.HEALTHTEC.add();
    apiTestes.testes.api['userEntry'].execute();

    console.log('loaded ' + this.client);

}

var param = {field:'título'};

app.factory('campo',function($interpolate) {
    var fn = $interpolate("O campo '{{field}}' é obrigatório!");
    var result = fn(param);
    console.log(result);
});

