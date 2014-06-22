package pt.core.validators;

import java.util.regex.Pattern;

public class EmailChecker {
    private static final String EMAIL_PATTERN =
            "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
    private static Pattern pattern = null;

    private static Pattern getPattern() {
        if (pattern == null) {
            pattern = Pattern.compile(EMAIL_PATTERN);
        }
        return pattern;
    }

    public static boolean check(Object object){
        if(object instanceof String) return check((String)object);
        else return false;
    }

    public static boolean check(String string) {
        return getPattern().matcher(string).matches();
    }

}
