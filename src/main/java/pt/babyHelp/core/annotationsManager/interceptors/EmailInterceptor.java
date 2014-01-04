package pt.babyHelp.core.annotationsManager.interceptors;


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
@InterceptorAnnotation(priority = 1)
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface EmailInterceptor {
}