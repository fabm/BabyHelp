package pt.babyHelp.validation;

import pt.gapiap.proccess.validation.DefaultValidator;
import pt.gapiap.proccess.validation.ValidationContext;
import pt.gapiap.proccess.validation.ValidationMethod;
import pt.gapiap.proccess.validation.annotations.Email;
import pt.gapiap.proccess.validation.annotations.Required;

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
