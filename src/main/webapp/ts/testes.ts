/// <reference path="def/testes.d.ts" />
/// <reference path="app.ts" />

var cbh = new ClientBabyHelp();
cbh.client = ("userBH");
var resToken;




var testes = {
    success: null,
    error: (x)=>{},
    unauthorized: (x)=>{},
    users:{
        list:()=>{}
    },
    articles:{
        getService:()=>{
            return null;
        },
        create:()=>{},
        alterLast:(order:number)=>{},
        list:()=>{},
        delete:(orders)=>{}
    },
    upload:()=>{},
    loadClientPhotoToken:(x)=>{}
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

    var fargs = new FUploadArgs();
    fargs.events.error = function(error){
        alert(error);
    }
    fargs.events.success = function(success){
        $scope.imagekey = success;
    }

    function loadResponse(response) {
        fargs.options.email = response.email;
        fargs.options.url = response.url;
        fargs.options.file = $scope.upFile;
        fUploadAppEngine.up(fargs);
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

function logThen(resolve:Resolve,trace?:boolean){
    var cbSuccess = (success)=>{
        console.log('success:');
        console.info(success);
        if(trace)
            console.trace();
    }
    var cbError = (error)=>{
        console.log('error:');
        console.info(error);
        if(trace)
            console.trace();
    }
    var cbUnauthorized = (unauthorized)=>{
        console.log('unauthorized:');
        console.info(unauthorized);
        if(trace)
            console.trace();
    }
    resolve.then(cbSuccess,cbError,cbUnauthorized);
}