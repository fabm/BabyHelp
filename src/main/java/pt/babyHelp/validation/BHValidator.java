package pt.babyHelp.validation;

import pt.json.proccess.validation.DefaultValidator;
import pt.json.proccess.validation.ValidationContext;
import pt.json.proccess.validation.ValidationMethod;
import pt.json.proccess.validation.annotations.Email;
import pt.json.proccess.validation.annotations.Required;

public class BHValidator {
    private DefaultValidator defaultValidator = new DefaultValidator();

    @ValidationMethod(value = Required.class, priority = 1)
    public boolean valRequired(ValidationContext<Required> context) {
        return defaultValidator.valRequired(context);
    }

    @ValidationMethod(Email.class)
    public boolean valEmail(ValidationContext<Email> context) {
        return defaultValidator.valEmail(context);
    }
}
