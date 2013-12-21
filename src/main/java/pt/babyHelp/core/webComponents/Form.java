package pt.babyHelp.core.webComponents;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 19/12/13
 * Time: 23:13
 * To change this template use File | Settings | File Templates.
 */
public abstract class Form extends WebComponent {
    protected Form() {
        getDependences().add(Dependece.JQUERY);
    }
}
