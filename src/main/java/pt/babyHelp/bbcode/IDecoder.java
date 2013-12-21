package pt.babyHelp.bbcode;

/**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 27/10/13
 * Time: 14:20
 * To change this template use File | Settings | File Templates.
 */
public interface IDecoder {
    String getInicio();
    String getFim();
    String transforma(String string);
}
