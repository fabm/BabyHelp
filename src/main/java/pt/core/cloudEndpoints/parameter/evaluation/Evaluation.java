package pt.core.cloudEndpoints.parameter.evaluation;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface Evaluation {
    String name() default "";
    String alias() default "";
    String[] validations() default {};
}
