$.fn.existe = function () {
    return this.length !== 0;
}

$.fn.scrollTo = function (altura) {
    if (!$(this).existe()) {
        console.error("Não é possível fazer scroll de um elemento que não existe");
        return;
    }
    if (altura == undefined)
        altura = $(this).height();
    elemento = $(this).filter(":first");
    var offset = elemento.offset();
    var offsetTop = offset.top;
    var totalScroll = offsetTop - altura;

    $('body,html').animate({
        scrollTop: totalScroll
    }, 500);
    return this;
}


$.fn.carregaGaleria = function (opcoes) {


    if (!$(this).existe()) {
        console.error("Não é possível criar a galeria num elemento que não existe");
        return;
    }

    galeria = $(this).get(0);
    $(this).addClass("galeria");

    var elImg = null;
    var elEnviaUrlParaEditor = $('<a class = "aIcons"><span class="icons" >i</span> insere no editor </a>');
    var elMostraEsconde = $('<a class="aIcons"><span class="icons">m</span> mostra/esconde imagem selecionada</a>');
    var toggleImagem = function () {
        elImg.slideToggle({
            'duration': 1000,
            'complete': function () {
                elEnviaUrlParaEditor.slideToggle(1000);
            }
        });
    };


    var evt_carrega_imagem = null;
    if ((typeof opcoes) === 'object' && (typeof opcoes.fn) === 'function')
        evt_carrega_imagem = opcoes.fn;

    function iCarregaGaleria(opcoes) {

        if ((typeof opcoes) !== 'object') {
            throw 'O envio do parametro opções é obrigatório'
        }

        if ((typeof opcoes.url) !== 'string') {
            throw 'opção url inválida'
        }

        albumSelecionado = 0;

        $.ajax(opcoes).done(function (data) {
                albuns = data["albuns"];
                imagens = data["imagens"];
                var painelImagemReal = null;

                //tipo 0 = albuns, 1 = foto
                embrulhando = function (url, txt, tipo) {
                    img = $('<img/>');
                    img.attr('src', url);
                    img.attr('width', '80px');
                    img.attr('height', '80px');
                    emb = $('<div class="' + tipo + 'Galeria"></div>');
                    $(emb).append(img);
                    $(emb).append("<span class='txt_icon_galeria'>" + txt + "</span>");

                    return emb;
                }

                //albuns
                var arrDados = []
                $.each(albuns, function (index, album) {
                    pasta = 'data:image/png;base64,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';
                    elAlbum = embrulhando(pasta, album.nome, 'album');
                    if (data.album_seleccionado == index)
                        $(elAlbum).addClass("selecionado");

                    $(elAlbum).attr("data-index", index);
                    arrDados[index] = album.opcoes

                    $(elAlbum).click(
                        function () {
                            $(galeria).empty();
                            var dados = arrDados[$(this).data('index')];
                            iCarregaGaleria(dados);
                        }
                    );
                    $(galeria).append(elAlbum);
                });


                //imagens
                var elEnviaUrlParaEvento = null;
                var url_imagem_atual = null;
                elImg = null;
                $.each(imagens, function (index, imagem) {
                    elFoto = embrulhando(imagem.mini, imagem.nome, 'foto');
                    $(elFoto).attr("data-url", imagem.url);
                    $(elFoto).click(function () {

                        url_imagem_atual = $(this).data("url");
                        var el = $('<div/>');


                        if (painelImagemReal == null) {
                            painelImagemReal = $('<div/>');

                            elImg = $('<img src="' + url_imagem_atual + '" alt="' + imagem.nome + '"/ >');
                            painelImagemReal.append(elImg);

                            if (evt_carrega_imagem != null) {
                                $(elEnviaUrlParaEditor).click(function () {
                                    evt_carrega_imagem(url_imagem_atual);
                                });
                            }

                            elMostraEsconde.click(function () {
                                toggleImagem();
                            });

                            painelImagemReal.append(elEnviaUrlParaEditor);

                            $(galeria).append(painelImagemReal);
                        } else {
                            url_imagem_atual = $(this).data("url");
                            elImg.attr("src", url_imagem_atual);
                            if (elImg.filter(":hidden").existe()) {
                                toggleImagem();
                            }
                        }
                        $(galeria).append(elEnviaUrlParaEditor);
                        $(galeria).append(elMostraEsconde);

                        $(galeria).children(".fotoGaleria").removeClass("selecionado");
                        $(this).addClass("selecionado");
                    });
                    $(galeria).append(elFoto);
                });
            }
        ).fail(function () {
                alert('não foi possível enontrar o caminho:');
            });
    }

    iCarregaGaleria(opcoes);
}