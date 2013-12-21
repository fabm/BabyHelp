package pt.babyHelp.bd;

import com.googlecode.objectify.annotation.Embed;

/**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 20/10/13
 * Time: 16:02
 * To change this template use File | Settings | File Templates.
 */
@Embed
public class Partilha {
    private String utilizador;
    private String conteudo;

    public String getUtilizador() {
        return utilizador;
    }

    public void setUtilizador(String utilizador) {
        this.utilizador = utilizador;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }
}
