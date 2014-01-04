package pt.babyHelp.core.validators;

import pt.babyHelp.core.webComponents.inputs.Input;

import java.text.MessageFormat;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 31/12/13
 * Time: 11:56
 * To change this template use File | Settings | File Templates.
 */
public class NotEmptyValidator<T> implements Validator<T> {
    private static NotEmptyValidator instance = null;

    public static NotEmptyValidator getInstance() {
        if (instance == null) {
            instance = new NotEmptyValidator();
        }
        return instance;
    }

    @Override
    public boolean validate(Input<T> input) {

        if (input.getValue() == null) return true;
        if(input.getValue().toString().isEmpty()){
            return false;
        }
        return true;
    }

    @Override
    public String getMessage(Object... args) {
        return MessageFormat.format(
                DefaultErrorMessages.getInstance().get("EmptyException"),
                args
        );
    }

}
