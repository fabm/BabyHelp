cbh = new ClientBabyHelp(Log.cbr);
cbh.client = ("userBH");
var resToken;
cbh.loadApi(function () {
    t = gapi.client.userBH.create.session();
    t.execute(function (res) {
        resToken = res;
        console.log("iniciado");
    });
});

var testes = {
    success: null,
    error: null,
    unauthorized: null
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

testes.users = {}

testes.users.list = function loadTestUserService() {
    var userService = injector('userService');
    resolveThen(userService.list());
}

testes.articles = {};

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

testes.articles.delete = function (orders) {
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

app.service('fUpload', function ($http) {
    var self = this;
    var upEvent;

    function afterUrl(file,url){
        var fd = new FormData();
        fd.append('file', file);

        $http.post(url, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(data){
            console.log("imagekey:");
            console.log(data);
            upEvent(data.imagekey);
        })
        .error(function(data){
            console.log("erro imagekey:");
            console.log(data);
        });
    }

    this.up = function(file, updateEvent){
        upEvent = updateEvent;
        console.log("serviço de upload");

        $http.get('/upload')
        .success(function(data){
            console.log("sessão url:");
            console.log(data);
            afterUrl(file,data.url);
        })
        .error(function(data){
            console.log("sessão url erro:");
            console.log(data);
        });
    }
});


function InnerController($scope,$http,fUpload) {
    function updateImage(imagekey){
        $scope.imagekey = imagekey;
    }

    $scope.send = function(){
        fUpload.up($scope.upFile, updateImage);
    }
}
testes.login = function(){
    var ch = new ClientBabyHelp();
    cfg = ch.getAuthConfig(false);
    cfg.approval_prompt = 'force';
    //sem authuser portanto tirar no getconfig
    delete cfg.authuser;
    gapi.auth.authorize(cfg,Log.cbr);
}

