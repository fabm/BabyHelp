package pt.babyHelp.core.validators;

import pt.babyHelp.bundle.BundleMap;
import pt.babyHelp.core.validators.DefaultErrorMessages;
import pt.babyHelp.core.validators.Validator;
import pt.babyHelp.core.webComponents.inputs.Input;

import java.text.MessageFormat;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 24/12/13
 * Time: 09:10
 * To change this template use File | Settings | File Templates.
 */
public class EmailValidator implements Validator<String> {
    private static final String EMAIL_PATTERN =
            "^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@"
                    + "[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$";
    private static Pattern pattern = null;
    private static EmailValidator instance = null;


    private static Pattern getPattern(){
        if(pattern==null){
            pattern = Pattern.compile(EMAIL_PATTERN);
        }
        return pattern;
    }

    public static EmailValidator getInstance(){
        if(EmailValidator.instance == null){
            EmailValidator.instance = new EmailValidator();
        }
        return EmailValidator.instance;
    }

    @Override
    public boolean validate(Input<String> input) {
        if(input.getValue()==null) return true;
        Matcher matcher = EmailValidator.getPattern().matcher(input.getValue().toString());
        if (!matcher.matches()) {
            return false;
        }
    return true;
    }

    @Override
    public String getMessage(Object... args) {
        return MessageFormat.format(
                DefaultErrorMessages.getInstance().get("EmailFormatException"),
                args
        );
    }
}
