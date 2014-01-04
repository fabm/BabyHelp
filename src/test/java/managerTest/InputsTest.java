package managerTest;

import pt.babyHelp.core.EventValidation;
import pt.babyHelp.core.Manager;
import pt.babyHelp.core.validators.*;
import pt.babyHelp.core.webComponents.inputs.Input;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 31/12/13
 * Time: 18:14
 * To change this template use File | Settings | File Templates.
 */
public class InputsTest extends DefaultEventValidation {
    @ValidationAssociation(IntegerValidator.class)
    @ValidationAssociation(NotEmptyValidator.class)
    private Input<Integer> inteiro;
    @ValidationAssociation(value = EmailValidator.class, createNew = false)
    private Input<String> email;

    private

    private Input numero;

    public Input<Integer> getInteiro() {
        return inteiro;
    }

    public Input<String> getEmail() {
        return email;
    }

    public Input getNumero() {
        return numero;
    }

    @Override
    protected boolean validation(Input input) {
        System.out.println(input.getName());
        return true;
    }

    @Override
    protected boolean validation(Input input, Validator validator) {
        return false;
    }

    @Override
    protected boolean validation(Input input, boolean isValid) {
        return false;
    }

    @Override
    protected boolean problemWithReflection(Exception e) {
        return false;
    }

}
