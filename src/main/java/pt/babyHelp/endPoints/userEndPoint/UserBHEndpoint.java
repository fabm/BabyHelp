package pt.babyHelp.endPoints.userEndPoint;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.Role;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.session.UserContext;
import pt.babyHelp.endPoints.Authorization;
import pt.babyHelp.endPoints.Constants;
import pt.babyHelp.services.UserBHService;
import pt.babyHelp.services.impl.UserBHServiceImpl;

import java.util.Map;

import static com.google.api.server.spi.config.ApiMethod.HttpMethod;


@Api(name = "userBH",
        version = "v1",
        description = "Endpoint do user BabyHelp",
        scopes = {Constants.EMAIL},
        clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID,
                Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
        audiences = {Constants.ANDROID_AUDIENCE}
)
public class UserBHEndpoint {

    private UserBHService userBHService = new UserBHServiceImpl();
    private UserContext userContext;

    void setUserContext(User user){
        userContext = UserContext.createUserContext(user);
    }

    @ApiMethod(name = "create.token", httpMethod = HttpMethod.GET, path = "token")
    public Map<String, Object> currentEmail(User user) throws UnauthorizedException {
        try {
            setUserContext(user);
            Authorization.check(userContext, "criação de um token para áreas reservadas");
            this.userBHService.setUserContext(userContext);
            return this.userBHService.createToken();
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }


    @ApiMethod(name = "updateRoles", httpMethod = HttpMethod.POST)
    public Map<String, Object> updateRoles
            (User user, @Named("email") String email, RolesParameters rolesParameters)
            throws UnauthorizedException {
        try {
            setUserContext(user);
            Authorization.check(userContext, "atualização de utilizadores", Role.ADMINISTRATOR);
            this.userBHService.setUserContext(userContext);
            return this.userBHService.updateRoles(email, rolesParameters);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @ApiMethod(name = "list")
    public Map<String, Object> list(User user) throws UnauthorizedException {
        try {
            setUserContext(user);
            Authorization.check(userContext, "listagem de utilizadores", Role.ADMINISTRATOR);
            this.userBHService.setUserContext(userContext);
            return this.userBHService.list();
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @ApiMethod(name = "getRoles")
    public Map<String, Object> getRoles(User user, @Named("email") String email) throws UnauthorizedException {
        try {
            setUserContext(user);
            Authorization.check(userContext,"verificação de roles",Role.ADMINISTRATOR);
            this.userBHService.setUserContext(userContext);
            return this.userBHService.getRoles(email);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

}