package pt.babyHelp.utils;

import java.io.UnsupportedEncodingException;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 07/12/13
 * Time: 18:17
 * To change this template use File | Settings | File Templates.
 */
public class CharsetConverter {
    public static String latin1ToUTF8(String string) throws UnsupportedEncodingException {
        return new String(string.getBytes("ISO-8859-1"),"UTF-8");
    }
}
