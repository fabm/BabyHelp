package pt.babyHelp.endPoints;

import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.session.UserContext;

public interface UserAcessible {
    void setUserContext(UserContext userContext) throws EndPointError;
}

