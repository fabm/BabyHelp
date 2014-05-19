package environment;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 23/01/14
 * Time: 22:02
 * To change this template use File | Settings | File Templates.
 */
public class Ordinals {
    public static String[] ORDINAL={
            "first",
            "second",
            "third",
            "fourth",
            "fifth",
            "sixth",
            "seventh",
            "eighth",
            "ninth",
            "tenth",
            "eleventh",
            "twelfth",
            "thirteenth",
            "fourteenth",
            "fifteenth",
            "sixteenth",
            "seventeenth",
            "nineteenth",
            "twentieth",
            "twentieth"
    };

    public static String getOrdinal(int indice){
        return ORDINAL[indice-1];
    }
}
