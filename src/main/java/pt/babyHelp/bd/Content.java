package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Embed;

@Embed
public class Content {
    private Type type;
    private UserFromApp owner;
    private Key<UserFromApp> shared;

    public static enum Type {
        ALL, CUSTOM, NONE;
    }

}
