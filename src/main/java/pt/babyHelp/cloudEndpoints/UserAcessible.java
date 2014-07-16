package pt.babyHelp.cloudEndpoints;

import com.google.appengine.api.users.User;

public interface UserAcessible {
    void setUser(User user);
    BHAuthorization getAuthorization();
}

