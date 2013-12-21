package pt.babyHelp.core;

import java.io.UnsupportedEncodingException;
import java.util.Locale;
import java.util.ResourceBundle;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 07/12/13
 * Time: 16:17
 * To change this template use File | Settings | File Templates.
 */
public class BundleHelper {
    ResourceBundle resourceBundle;
    public BundleHelper() {
        resourceBundle = ResourceBundle.getBundle("bundle.bundle", Locale.getDefault());
    }

    public String getMessage(String key) throws UnsupportedEncodingException {
        return new String(resourceBundle.getString(key).getBytes("ISO-8859-1"),"UTF-8");
    }
}
