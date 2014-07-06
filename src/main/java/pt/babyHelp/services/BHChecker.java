package pt.babyHelp.services;

import pt.core.cloudEndpoints.CEError;
import pt.core.cloudEndpoints.CEErrorReturn;
import pt.core.validation.GlobalError;
import pt.json.proccess.Bundle;
import pt.json.proccess.validation.BeanChecker;
import pt.json.proccess.validation.DefaultValidator;
import pt.json.proccess.validation.ValidationContext;
import pt.json.proccess.validation.annotations.Email;
import pt.json.proccess.validation.annotations.Required;

import java.lang.annotation.Annotation;

public class BHChecker {
    private BeanChecker<DefaultValidator> beanChecker = new BeanChecker();

    private static boolean isEqual(CEErrorReturn ceErrorReturn, GlobalError globalError) {
        if (!(ceErrorReturn instanceof GlobalError)) return false;
        return ceErrorReturn == globalError;
    }

    public <T> T check(Object object) throws CEError {
        T ret = beanChecker.check(object);

        DefaultValidator val = beanChecker.getValidator();
        Annotation annotation;
        ValidationContext<?> valContext = val.getValidationContext();
        if (valContext == null)
            return ret;

        annotation = val.getValidationContext().getAnnotation();

        if (annotation.annotationType() == Required.class)
            throw new CEError(BabyHelpError.REQUIRED_FIELD,getFieldName(valContext));
        if (annotation.annotationType() == Email.class)
            throw new CEError(BabyHelpError.EMAIL);
        throw new CEError(BabyHelpError.TYPE_NOT_CORRESPOND);
    }

    private static String getFieldName(ValidationContext<?> validationContext){
        Bundle bundle = new Bundle("alias");
        String alias = bundle.getString(
                validationContext.getContainer().getClass().getName() +"."+
                        validationContext.getName()
        );
        if(alias == null) return validationContext.getName();
        return alias;
    }
}
