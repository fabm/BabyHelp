package pt.babyHelp.endPoints;


import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.Role;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.session.UserContext;

public class Authorization {
    public static void check(User user, String area, Role... roles) throws UnauthorizedException, EndPointError {
        if (user == null) {
            throw new UnauthorizedException(String.format("Não é possível aceder à área de '%s' sem fazer login", area));
        }
        UserFromApp userFromApp = UserFromApp.findByEmail(user.getEmail());
        if(userFromApp==null){
            userFromApp = new UserFromApp();
            userFromApp.setEmail(user.getEmail());
        }
        UserContext userContext = UserContext.createUserContext(userFromApp);
        check(userContext, area, roles);
    }

    public static void check(UserContext userContext, String area, Role... roles) throws UnauthorizedException {
        if (!userContext.hasRules(roles)) {
            throw new UnauthorizedException(String.format("Não tem previlégios suficientes para aceder à área de '%s'",area));
        }
    }
}
