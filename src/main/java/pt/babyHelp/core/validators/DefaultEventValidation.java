package pt.babyHelp.core.validators;

import pt.babyHelp.core.EventValidation;
import pt.babyHelp.core.webComponents.inputs.Input;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Collection;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 04/01/14
 * Time: 09:44
 * To change this template use File | Settings | File Templates.
 */
public abstract class DefaultEventValidation implements EventValidation {
    abstract protected boolean validation(Input input);

    abstract protected boolean validation(Input input, Validator validator);

    abstract protected boolean validation(Input input, boolean isValid);

    abstract protected boolean problemWithReflection(Exception e);

    @Override
    public boolean isValid() {
        boolean result = true;
        for (Field field : this.getClass().getDeclaredFields()) {
            if (Input.class.isAssignableFrom(field.getType())) {
                Collection<ValidationAssociation> validationAssociations =
                        getValidationAssociations(field);
                Input input = null;
                try {
                    input = (Input) field.get(this);
                } catch (IllegalAccessException e) {
                    problemWithReflection(e);
                }
                if (validationAssociations.isEmpty()) {
                    result = validation(input) && result;
                } else {
                    for (ValidationAssociation validationAssociation : validationAssociations) {
                        Validator validator = null;
                        Class<? extends Validator> validatorClass = validationAssociation.value();
                        if (validationAssociation.createNew()) {
                            try {
                                validator = validatorClass.newInstance();
                            } catch (InstantiationException e) {
                                problemWithReflection(e);
                            } catch (IllegalAccessException e) {
                                problemWithReflection(e);
                            }
                        } else {
                            try {
                                Method getInstanceMethod = validatorClass.getDeclaredMethod("getInstance");
                                validator = (Validator) getInstanceMethod.invoke(validator);
                            } catch (ClassCastException e) {
                                problemWithReflection(e);
                            } catch (NoSuchMethodException e) {
                                problemWithReflection(e);
                            } catch (InvocationTargetException e) {
                                problemWithReflection(e);
                            } catch (IllegalAccessException e) {
                                problemWithReflection(e);
                            }
                        }
                        boolean isValid = validator.validate(input);
                        if (validationAssociation.automatic()) {
                            result = validation(input, isValid) && result;
                        } else {
                            result = validation(input, validator) && result;
                        }
                    }
                }
            }
        }
        return false;
    }

    private Collection<ValidationAssociation> getValidationAssociations(Field field) {
        ArrayList<ValidationAssociation> validationAssociations = new ArrayList<ValidationAssociation>(field.getDeclaredAnnotations().length);

        for (Annotation annotation : field.getDeclaredAnnotations()) {
            if (ValidationAssociation.class.isAssignableFrom(annotation.getClass())) {
                validationAssociations.add((ValidationAssociation) validationAssociations);
            }
        }
        return validationAssociations;
    }

}
