package pt.babyHelp.endPoints;

import com.google.appengine.api.users.User;
import pt.babyHelp.core.endpoints.EndPointError;

public interface UserAcessible {
    void setUser(User user) throws EndPointError;
}

