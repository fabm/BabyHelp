package pt.babyHelp.utils;

/**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 02/11/13
 * Time: 22:22
 * To change this template use File | Settings | File Templates.
 */
public class Caster {
    @SuppressWarnings("unchecked")
    public static <T>T cast(Object obj){
        if(obj == null){
            throw new NullCastException();
        };
        return (T)obj;
    }

}
