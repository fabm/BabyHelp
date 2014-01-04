package pt.babyHelp.core.validators.annotations;


import pt.babyHelp.core.validators.Validator;

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
@Target(ElementType.FIELD)
public @interface ValidationAssociation{
    Class<? extends Validator> value();
    boolean createNew() default true;
    boolean automatic() default true;
}