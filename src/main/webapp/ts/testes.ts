/// <reference path="def/testes.d.ts" />
/// <reference path="app.ts" />

var cbh = new ClientBabyHelp();
cbh.client = ("userBH");
var resToken;


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
    var clientBabyHelp = new ClientBabyHelp();
    clientBabyHelp.client = 'photoToken';
    clientBabyHelp.loadApi(function (client) {
        callback(client);
    });
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

function logThen(resolve:Resolve, trace?:boolean) {
    var cbSuccess = (success)=> {
        console.log('success:');
        console.info(success);
        if (trace)
            console.trace();
    }
    var cbError = (error)=> {
        console.log('error:');
        console.info(error);
        if (trace)
            console.trace();
    }
    var cbUnauthorized = (unauthorized)=> {
        console.log('unauthorized:');
        console.info(unauthorized);
        if (trace)
            console.trace();
    }
    resolve.then(cbSuccess, cbError, cbUnauthorized);
}

class ArticleParamTest implements ArticleCreation {
    isPublic:boolean = true;
    body:string = 'bla bla body';
    summary:string = 'bla bla summary';
    title:string = 'bla, title';
    photoUrl:string = 'xxx';
}

class ApisHelper extends ClientBabyHelp {

    c:{[index:string]:any};
    afterLoad = function (name) {
        console.log('loaded ' + name);
    }

    static attribClient(client, context) {
        for (var m in client) {
            if (typeof (client[m]) === 'function')
                context[m] = {
                    args: undefined,
                    mName: m,
                    argsEval: function () {
                        var self = this;
                        client[this.mName]({'eval': true}).execute((response)=> {
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
                    execute: function () {
                        var self = this;

                        function getValidation(name, value):{error:boolean;message?:string} {
                            var valArr = self['validations'][name];
                            if (!isNull(valArr))
                                for (var val in valArr) {
                                    if(!apiTestes['validations'][valArr[val]].check(value)){
                                        var al = self['alias'][name];
                                        al=(al==undefined)?name:al;
                                        return {
                                            error:true,
                                            message:apiTestes['validations'][valArr[val]].alert(al)
                                        }
                                    }
                                }
                            return {error:false};
                        }

                        if (!isNull(this.args) && !isNull(this['validations']))
                            for (var p in self.validations) {
                                var ret = getValidation(p,self.args[p]);
                                if(ret.error)return ret;
                            }
                        client[this.mName](this.args).execute((response)=> {
                            this.response = response;
                            console.log(response);
                        });
                    }
                }
            else {
                context[m] = {};
                ApisHelper.attribClient(client[m], context[m]);
            }
        }
    }

    static getRoles() {
        var allRoles = UserService.loadAllRoles();
        var myRoles = {};
        for (var i in allRoles) {
            myRoles[allRoles[i].name] = allRoles[i].name;
        }
        return myRoles;
    }

    helpLoader(name) {
        var self = this;
        this.client = name;
        super.loadApi((client=> {
            self.c = {};
            ApisHelper.attribClient(client, self.c);
            self.afterLoad(name);
        }));
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
    article: new ApisHelper(),
    user: new ApisHelper(),
    testes: new ApisHelper()
}

apiTestes.article.helpLoader('article');
apiTestes.user.helpLoader('userBH');
apiTestes.testes.helpLoader('testes');

apiTestes.article.afterLoad = function (name) {
    apiTestes.article.c['create'].args = new ArticleParamTest();
    console.log('loaded ' + name);
}
apiTestes['validations'] = {
    EMAIL: {
        check(value) {
            return /^[_A-Za-z0-9-\+]+(\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\.[A-Za-z0-9]+)*(\.[A-Za-z]{2,})$/.test(value);
        },
        alert(alias) {
            return "O campo " + alias + " não é reconhecido como email";
        }
    },
    REQUIRED: {
        check(value) {
            if (isNull(value))return false;
            if (value.length == 0) return false;
            return true;
        },
        alert(alias) {
            return "O campo " + alias + " não pode ser vazio";
        }
    }
}

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

}
