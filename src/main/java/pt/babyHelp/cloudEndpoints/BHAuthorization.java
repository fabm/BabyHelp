package pt.babyHelp.cloudEndpoints;

import com.google.appengine.api.users.User;
import pt.babyHelp.services.BabyHelp;
import pt.core.cloudEndpoints.Authorization;

public class BHAuthorization extends Authorization {

    public BHAuthorization(User user) {
        super(user);
        noNameUser = BabyHelp.CEError.NO_NAME_USER;
    }
}
