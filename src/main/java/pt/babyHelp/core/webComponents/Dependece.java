package pt.babyHelp.core.webComponents;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 21/12/13
 * Time: 18:55
 * To change this template use File | Settings | File Templates.
 */
public enum Dependece {
    JQUERY_TOOLS,ONE_BUTTON_SUBMIT;

    public String getString(){
        switch (this){
            case JQUERY_TOOLS:
                return "<script src=\"http://cdn.jquerytools.org/1.2.7/full/jquery.tools.min.js\"></script>";
            default:return null;
        }
    }
}
