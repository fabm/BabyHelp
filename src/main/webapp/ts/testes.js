cbh = new ClientBabyHelp(Log.cbr);
cbh.client=("userBH");
var resToken;
cbh.loadApi(function(){
    t = gapi.client.userBH.create.session();
    t.execute(function(res){
        resToken = res;
        console.log("iniciado");
    });
});



function loadTest() {
    userService = angular.element(document.body).injector().get('userService');

    userService.list().then(
        function (response) {
            console.log('sucess:');
            console.log(response);
        },
        function (response) {
            console.log('error:');
            console.log(response);
        },
        function (response) {
            console.log('unauthorized:');
            console.log(response);
        }
    );
}