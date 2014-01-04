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
public class IntegerValidator implements Validator<Integer> {
    private static IntegerValidator instance = null;

    public static IntegerValidator getInstance() {
        if (instance == null) {
            instance = new IntegerValidator();
        }
        return instance;
    }

    @Override
    public boolean validate(Input<Integer> input) {
        Input<? extends Object> unparsedInteger = input;
        if (unparsedInteger.getValue() == null) return true;
        try {
            input.setValue(Integer.parseInt(unparsedInteger.getValue().toString()));
            return true;
        } catch (NumberFormatException nfe) {
            return false;
        }
    }

    @Override
    public String getMessage(Object...args) {
        return MessageFormat.format(
                DefaultErrorMessages.getInstance().get("NumberFormatException"),
                args
        );
    }

}
