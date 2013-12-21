package pt.babyHelp.core.webComponents;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 21/12/13
 * Time: 18:55
 * To change this template use File | Settings | File Templates.
 */
public class Dependece {

    public enum Type{
        JAVASCRIPT,CSS
    }

    private Dependece() {
    }

    public static Dependece create(Type type, String name){
        Dependece dependece = new Dependece();
        return dependece;
    }
    public static final Dependece JQUERY= create(Type.JAVASCRIPT,"http://cdn.jquerytools.org/1.2.7/full/jquery.tools.min.js");
    private String name;
    private Type type;

    public String getName() {
        return name;
    }

    public Type getType() {
        return type;
    }
}
