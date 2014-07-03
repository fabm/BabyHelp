package com.annotation.processor.validation;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface BeanCheckerAnnotation {
    Class<? extends Annotation>[] value();
}
