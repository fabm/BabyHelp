package pt.babyHelp.endPoints.userEndPoint;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.urlfetch.HTTPMethod;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.Role;
import pt.babyHelp.core.endpoints.EndPointError;
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

    @ApiMethod(name = "currentEmail", httpMethod = HttpMethod.GET)
    public Map<String, Object> currentEmail(User user) throws UnauthorizedException {
        Authorization.check(user,"verificação do email atual");
        this.userBHService.setUser(user);
        return this.userBHService.currentEmail();
    }


    @ApiMethod(name = "checkRoles", httpMethod = HttpMethod.POST)
    public Map<String, Object> checkRoles(User user, RolesParameters rolesParameters)
            throws UnauthorizedException{
        this.userBHService.setUser(user);
        try {
            return this.userBHService.checkRoles(rolesParameters);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @ApiMethod(name = "updateRoles",httpMethod = HttpMethod.POST)
    public Map<String, Object> updateRoles
            (User user, @Named("email") String email, RolesParameters rolesParameters)
            throws UnauthorizedException{
        Authorization.check(user,"atualização de utilizadores", Role.ADMINISTRATOR);
        this.userBHService.setUser(user);
        try {
            return this.userBHService.updateRoles(email, rolesParameters);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @ApiMethod(name = "removeRole")
    public Map<String, Object> removeRole(
            User user, @Named("email") String email, @Named("role") String role)
            throws UnauthorizedException{
        Authorization.check(user,"remoção de utilizadores", Role.ADMINISTRATOR);
        this.userBHService.setUser(user);
        try {
            return this.userBHService.removeRole(email, role);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @ApiMethod(name = "addRole")
    public Map<String, Object> addRole(
            User user, @Named("email") String email, @Named("role") String role)
            throws UnauthorizedException{
        Authorization.check(user,"adição de utilizadores", Role.ADMINISTRATOR);
        this.userBHService.setUser(user);
        try {
            return this.userBHService.addRole(email, role);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @ApiMethod(name = "list")
    public Map<String, Object> list(User user) throws UnauthorizedException {
        Authorization.check(user,"listagem de utilizadores", Role.ADMINISTRATOR);
        this.userBHService.setUser(user);
        try {
            return this.userBHService.list();
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }
    @ApiMethod(name = "getRoles")
    public Map<String, Object> getRoles(User user,@Named("email")String email) throws UnauthorizedException {
        Authorization.check(user,"edição de utilizadores", Role.ADMINISTRATOR);
        this.userBHService.setUser(user);
        try {
            return this.userBHService.getRoles(email);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

}