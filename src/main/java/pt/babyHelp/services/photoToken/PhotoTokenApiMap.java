package pt.babyHelp.services.photoToken;

import pt.babyHelp.bd.embededs.Role;
import pt.core.cloudEndpoints.services.CEApiMap;

public class PhotoTokenApiMap implements CEApiMap<Role> {
    public static final String GET = "get";


    @Override
    public Role[] getRoles() {
        return new Role[]{};
    }

    @Override
    public String getMethod() {
        return GET;
    }

    @Override
    public boolean autenticationRequired() {
        return true;
    }

    @Override
    public String getArea() {
        return "photo-token";
    }
}
