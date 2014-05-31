/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="gapis.ts" />

var app = angular.module("babyhelp", ['ui.router', 'ui.growl', 'ngCookies']);

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
                this.$state.go(state, null, { reload: true });
            }
        }
    };
});


app.factory('userService',()=>{
    return new UserService();
});