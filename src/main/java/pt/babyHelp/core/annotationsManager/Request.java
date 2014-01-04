package pt.babyHelp.core.annotationsManager;


import pt.babyHelp.core.webComponents.inputs.Input;
import pt.babyHelp.core.webComponents.inputs.InputDefault;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 29/11/13
 * Time: 21:29
 * To change this template use File | Settings | File Templates.
 */
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD, ElementType.METHOD})
public @interface Request {
    String name() default "";
    Class<? extends Input> inputClass() default InputDefault.class;
    RequestType requestType() default RequestType.REQUEST;
    String labelField() default "";
}