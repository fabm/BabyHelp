$(document).ready(function () {
    editor = CKEDITOR.instances.editor1;
    fnInserirHtml = function (url) {
        editor.insertHtml('<img src="' + url + '"/>');
    };
    $("#galeria").carregaGaleria({
        'url':"exemploDadosGaleria",
        'fn':fnInserirHtml,
        'data':{
            'album':0
        }
    });
});