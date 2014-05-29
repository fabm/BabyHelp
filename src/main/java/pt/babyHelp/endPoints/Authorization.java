package pt.babyHelp.endPoints;


import com.google.api.server.spi.response.UnauthorizedException;
import pt.babyHelp.bd.Role;
import pt.babyHelp.core.session.UserContext;

public class Authorization {

    public static void check(UserContext userContext, String area, Role... roles) throws UnauthorizedException {
        if(userContext == null){
            throw new UnauthorizedException(String.format("É necessário autenticar-se para aceder à área de '%s'",area));
        }
        if (!userContext.hasRules(roles)) {
            throw new UnauthorizedException(String.format("Não tem previlégios suficientes para aceder à área de '%s'",area));
        }
    }
}
