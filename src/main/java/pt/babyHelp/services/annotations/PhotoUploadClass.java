package pt.babyHelp.services.annotations;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.TYPE})
public @interface PhotoUploadClass {
    InstanceType type();
}

