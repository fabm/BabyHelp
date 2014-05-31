/// <reference path="lib.ts" />
/// <reference path="ext/angular/angular.d.ts" />
/// <reference path="ext/angular/angular-ui-router.d.ts" />
/// <reference path="ext/angular/angular-resource.d.ts" />
/// <reference path="gapis.ts" />
var _this = this;
var app = angular.module("babyhelp", ['ui.router', 'ui.growl', 'ngCookies']);

var GrowlBH = (function () {
    function GrowlBH($growl) {
        this.type = 0;
        this.$growl = $growl;
    }
    GrowlBH.prototype.setMessage = function (message, type) {
        this.msg = message;
        this.type = type;
    };

    GrowlBH.prototype.isMsgShowed = function () {
        return this.msg == null;
    };

    GrowlBH.prototype.showGrowl = function () {
        var self = this;
        if (isNull(this.msg))
            return;
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
    };
    GrowlBH.typeMessage = {
        success: 0, error: 1
    };
    return GrowlBH;
})();

app.factory('gns', function ($state, $growl) {
    return {
        growl: new GrowlBH($growl),
        state: {
            goto: function (state) {
                _this.$state.go(state, null, { reload: true });
            }
        }
    };
});

app.factory('userService', function () {
    return new UserService();
});
//# sourceMappingURL=services.js.map
