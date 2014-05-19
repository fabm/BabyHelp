package pt.babyHelp.endPoints;


import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.Role;
import pt.babyHelp.core.session.UserContext;

public class Authorization {
    public static void check(User user, String area, Role... roles) throws UnauthorizedException {
        if (user == null) {
            throw new UnauthorizedException(String.format("Não é possível aceder à área de '%s' sem fazer login", area));
        }
        UserContext userContext = UserContext.createUserContext(user);
        check(userContext, area, roles);
    }

    public static void check(UserContext userContext, String area, Role... roles) throws UnauthorizedException {
        if (!userContext.hasRules(roles)) {
            throw new UnauthorizedException(String.format("Não tem previlégios suficientes para aceder à área de '%s'"));
        }
    }
}
