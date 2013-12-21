package pt.babyHelp.bbcode;

/**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 27/10/13
 * Time: 14:23
 * To change this template use File | Settings | File Templates.
 */
public class SimpleDecoder implements IDecoder{
    private String inicio;
    private String fim;
    private String substitutoInicial;
    private String substitutoFinal;

    public void setInicio(String inicio) {
        this.inicio = inicio;
    }

    public void setFim(String fim) {
        this.fim = fim;
    }


    @Override
    public String getInicio() {
        return inicio;
    }

    @Override
    public String getFim() {
        return fim;
    }

    @Override
    public String transforma(String string) {
        return substitutoInicial+string+substitutoFinal;
    }
}
