var Log = (function () {
    function Log() {
    }
    Log.prt = function (msg) {
        console.trace();
        window.console.log(msg);
    };

    Log.prtError = function (msg) {
        console.trace();
        window.console.log(msg);
    };

    Log.cbr = function (response) {
        console.trace();
        window.console.log(response);
    };

    Log.cbf = function (response) {
        return function () {
            Log.prt(response);
        };
    };

    Log.transfer = function (obje) {
        var fn = function (objo) {
            obje = obje;
        };
        return fn;
    };
    return Log;
})();

function isNull(parameter) {
    if (parameter == undefined || parameter == null)
        return true;
    return false;
}

var isLocal = window.location.hostname == 'localhost';
//# sourceMappingURL=lib.js.map
