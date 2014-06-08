package pt.babyHelp.services;

import com.google.appengine.api.users.User;
import pt.babyHelp.endPoints.Authorization;

public class AuthorizatedService {
    private Authorization authorization;


    public AuthorizatedService(Authorization authorization) {
        this.authorization = authorization;
    }

    protected Authorization getAuthorization() {
        return authorization;
    }


}
