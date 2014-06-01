/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="gapis.ts" />

var app = angular.module("babyhelp", ['ui.router', 'ui.growl', 'ngCookies']);


app.directive('fileModel', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
});

app.service('fileUpload', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
            .success(function(){
            })
            .error(function(){
            });
    }

});

app.controller('myCtrlUpload', ['$scope', 'fileUpload', function($scope, fileUpload){

    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = "/fileUpload";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };

}]);

class AppEngineUpload {
    private urlToGetSessionUrl = '/upload'
    public urlSession;

    processUrlSession() {
        var self = this;
        var ajax = new XMLHttpRequest();
        ajax.open("GET", this.urlToGetSessionUrl, false);
        ajax.onload = function () {
            var response = eval('('+ajax.responseText+')');
            if (!response.error)
                self.urlSession = response.url;
        }
        ajax.send();
    }

}

class GrowlBH {
    static typeMessage = {
        success: 0, error: 1
    };

    private type:number = 0;
    private msg:string;
    private $growl;

    constructor($growl) {
        this.$growl = $growl;
    }

    setMessage(message:string, type:number) {
        this.msg = message;
        this.type = type;
    }

    isMsgShowed():boolean {
        return this.msg == null;
    }

    showGrowl() {
        var self = this;
        if (isNull(this.msg))return;
        var strType;
        var title;
        if (this.type == 0) {
            strType = 'success';
            title = 'Informação';
        } else if (this.type == 1) {
            strType = 'danger';
            title = 'Erro';
        }
        self.$growl.box(title, this.msg, {
            class: strType, sticky: false, timeout: 3000
        }).open();
        this.msg = null;
    }

}

app.factory('gns', ($state, $growl)=> {
    return{
        growl: new GrowlBH($growl),
        state: {
            goto: (state:string)=> {
                $state.go(state, null, { reload: true });
            }
        }
    };
});


app.factory('userService', ()=> {
    return new UserService();
});

app.factory('articleService', ()=> {
    return new ArticlesService();
});

