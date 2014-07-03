package pt.core.validators;

import com.annotation.processor.validation.BeanCheckerAnnotation;
import com.annotation.processor.validation.BeforeNow;
import com.annotation.processor.validation.Email;
import com.annotation.processor.validation.Required;
import pt.core.cloudEndpoints.CEError;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;

@BeanCheckerAnnotation({
        BeforeNow.class, Email.class, Required.class
})
public class BeanChecker {

    protected Class<? extends Annotation>[] getValidatorsAnnotation(Class<?> classAnnotated) {
        BeanCheckerAnnotation beanCheckerAnnotation = classAnnotated.getAnnotation(BeanCheckerAnnotation.class);
        if (beanCheckerAnnotation == null)
            throw new RuntimeException("Expecting the class " + classAnnotated.getName() + " was annotated with " +
                    BeanCheckerAnnotation.class.getName());
        return beanCheckerAnnotation.value();
    }

    public <T> T check(Object object) throws CEError {
        Class<? extends Object> cl = object.getClass();
        for (Field field : cl.getDeclaredFields()) {
            field.setAccessible(true);
            try {
                Object value = field.get(object);
                for (Class<? extends Annotation> annotationClass : getValidatorsAnnotation(BeanChecker.class))
                    checkCurrent(value, annotationClass);
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return (T)object;
    }

    protected void checkCurrent(Object object, Class<? extends Annotation> annotation) throws CEError {
        if (annotation == Required.class) {
            if (object == null) throw new CEError(GlobalError.REQUIRED);
            if (object.getClass() == String.class && object.toString().isEmpty())
                throw new CEError(GlobalError.REQUIRED);
        }
        if (object == null) return;
        if (annotation == Email.class) {
            if (object.getClass() != String.class)
                throw new CEError(GlobalError.EMAIL);
            if (!EmailChecker.check(object.toString()))
                throw new CEError(GlobalError.EMAIL);
        }
    }
}
