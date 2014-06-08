package pt.babyHelp.endPoints;

import com.google.appengine.api.users.User;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.session.UserContext;

public interface UserAcessible {
    void setUser(User user);
    Authorization getAuthorization();
}

