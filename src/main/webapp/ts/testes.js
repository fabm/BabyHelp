cbh = new ClientBabyHelp(Log.cbr);
cbh.setClient("userBH");
var resToken;
cbh.loadApi(function(){
    t = gapi.client.userBH.create.session();
    t.execute(function(res){
        resToken = res;
        console.log("iniciado");
    });
});
