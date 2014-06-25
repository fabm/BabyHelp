package pt.json.proccess;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

public interface Validation {
    @Retention(RetentionPolicy.SOURCE)
    @Target(ElementType.PARAMETER)
    public static @interface Email{}
    @Retention(RetentionPolicy.SOURCE)
    @Target(ElementType.PARAMETER)
    public static @interface Required{}
}
