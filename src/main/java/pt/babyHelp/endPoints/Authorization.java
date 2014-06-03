package pt.babyHelp.endPoints;


import com.google.api.server.spi.response.UnauthorizedException;
import pt.babyHelp.bd.Role;
import pt.babyHelp.core.session.UserContext;
import pt.babyHelp.services.UserBHService;

public class Authorization {

    public static void check(UserContext userContext, String area, Role... roles) throws UnauthorizedException {
        if(userContext == null){
            throw new UnauthorizedException(String.format(UserBHService.Error.NOT_AUTENTICATED.getMsg(),area));
        }
        if (!userContext.hasRules(roles)) {
            throw new UnauthorizedException(String.format(UserBHService.Error.WITHOUT_PREVILEGES.getMsg(),area));

        }
    }
}
