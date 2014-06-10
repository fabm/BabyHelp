package pt.babyHelp.bd;

import com.googlecode.objectify.Key;

public class Content {
    private Type type;
    private UserFromApp owner;
    private Key<UserFromApp> shared;

    public static enum Type {
        ALL, CUSTOM, NONE;
    }

}
