package pt.babyHelp.managers.index;

import pt.babyHelp.core.EventValidation;
import pt.babyHelp.core.validators.EmailValidator;
import pt.babyHelp.core.validators.NotEmptyValidator;
import pt.babyHelp.core.webComponents.inputs.InputDefault;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 07/12/13
 * Time: 18:59
 * To change this template use File | Settings | File Templates.
 */
public class IndexInputs implements EventValidation {
    private InputDefault<String> mail;

    public InputDefault<String> getMail() {
        return mail;
    }

    @Override
    public boolean isValid() {
        return NotEmptyValidator.getInstance().validate(mail)
                && EmailValidator.getInstance().validate(mail);
    }
}
