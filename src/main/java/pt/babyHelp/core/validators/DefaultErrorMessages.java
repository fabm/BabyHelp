package pt.babyHelp.core.validators;

import pt.babyHelp.bundle.BundleMap;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 31/12/13
 * Time: 17:03
 * To change this template use File | Settings | File Templates.
 */
public class DefaultErrorMessages extends BundleMap{
    static{
        instance = new DefaultErrorMessages();
    }
    private static DefaultErrorMessages instance;

    public static DefaultErrorMessages getInstance() {
        return instance;
    }

    public DefaultErrorMessages() {
        super("default_error_messages");
    }
}
