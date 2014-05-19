/**
 * @fileoverview
 * Provides methods for the Hello Endpoints sample UI and interaction with the
 * Hello Endpoints API.
 *
 * @requires Jq
 */

/** google global namespace for Google projects. */
var google = google || {};

/** devrel namespace for Google Developer Relations projects. */
google.devrel = google.devrel || {};

/** samples namespace for DevRel sample code. */
google.devrel.babyHelp = google.devrel.babyHelp || {};


/**
 * Client ID of the application (from the APIs Console).
 * @type {string}
 */
google.devrel.babyHelp.CLIENT_ID_LOCAL = '942158003504.apps.googleusercontent.com';
google.devrel.babyHelp.CLIENT_ID_REMOTE =
    '717083864077-ka1p4trp1dnbo7ttfd15gqf2r8q1v9og.apps.googleusercontent.com';
google.devrel.babyHelp.CLIENT_ID = google.devrel.babyHelp.CLIENT_ID_REMOTE;

/**
 * Scopes used by the application.
 * @type {string}
 */
google.devrel.babyHelp.SCOPES =
    'https://www.googleapis.com/auth/userinfo.email';
/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
google.devrel.babyHelp.signedIn = false;

google.devrel.babyHelp.signin = function (mode, callback) {
    gapi.auth.authorize({client_id: google.devrel.babyHelp.CLIENT_ID,
            scope: google.devrel.babyHelp.SCOPES, immediate: mode},
        callback);
};

google.devrel.babyHelp.auth = function () {
    if (!google.devrel.babyHelp.signedIn) {
        google.devrel.babyHelp.signin(false,
            google.devrel.babyHelp.userAuthed);
    } else {
        google.devrel.babyHelp.signedIn = false;
        document.getElementById('signinButton').innerHTML = 'Sign in';
        document.getElementById('authedGreeting').disabled = true;
    }
};

/**
 * Whether or not the user is signed in.
 * @type {boolean}
 */
google.devrel.babyHelp.signedIn = false;

/**
 * Loads the application UI after the user has completed auth.
 */
google.devrel.babyHelp.userAuthed = function () {
    var request = gapi.client.oauth2.userinfo.get().execute(function (resp) {
        if (!resp.code) {

            google.devrel.babyHelp.signedIn = true;
            //document.getElementById('signinButton').innerHTML = 'Sign out';
            //document.getElementById('authedGreeting').disabled = false;
            console.log(resp);
        } else {
            console.log(resp);
        }
    });
};

var callback = function (r) {
    console.log(r);
}
google.devrel.babyHelp.loaded={jquery:false,gapi:false};
google.devrel.babyHelp.initGapi = function (apiRoot) {
    gapi.client.load('oauth2', 'v2', callback);
    gapi.client.load('nextht', 'v1', callback,apiRoot);
    google.devrel.babyHelp.loaded.gapi = true;
    google.devrel.babyHelp.libsLoaded();
}

$(document).ready(function(){
    google.devrel.babyHelp.loaded.jquery = true;
    google.devrel.babyHelp.libsLoaded();
});

google.devrel.babyHelp.libsLoaded = function(){
    loadedLibs = google.devrel.babyHelp.loaded;
    if(loadedLibs.gapi && loadedLibs.jquery){
        google.devrel.babyHelp.init();
    }
}

google.devrel.babyHelp.init=function(){
    $("#criaTabela").click(function(){
        testPost(testPost1);
    });
}

function TablePaged() {
    this.hasNext = true;
    this.hasPrev = true;
    this.columns = [];
}



var testPost = function (/**TablePaged*/tp) {
    if (tp instanceof TablePaged) {
        gapi.client.nextht.nht.test.tabe.state(tp).execute(
            function (r) {
                var tabela = $("<table/>");
                for(var v in r.columns){
                    var row = $("<tr/>").text(r.columns[v]);
                    tabela.append(row);
                }
                $("#testeTebela").html(tabela);
            }
        );
    } else {
        throw "type invalid";
    }
}

