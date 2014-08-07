package pt.babyHelp.services;

import com.google.appengine.api.users.User;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.gapiap.services.Dispatcher;

public class BHDispatcher extends Dispatcher<Role>{

    public BHDispatcher(Object service) {
        super(service, RolesValidation.class);
    }
}
