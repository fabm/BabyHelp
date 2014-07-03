package com.annotation.processor.validation;

import java.lang.annotation.Annotation;

public class ValidationClasses {
    public static Class<? extends Annotation>[] annotations = new Class[]{
            BeforeNow.class, Required.class, Email.class
    };
}
