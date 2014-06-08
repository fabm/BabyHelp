package pt.babyHelp.endPoints.userEndPoint;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.core.endpoints.EndPointError;
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


    @ApiMethod(name = "updateRoles", httpMethod = HttpMethod.POST)
    public Map<String, Object> updateRoles
            (User user, @Named("email") String email, RolesParameters rolesParameters)
            throws UnauthorizedException {
        try {
            this.userBHService.setUser(user);
            return this.userBHService.updateRoles(email, rolesParameters);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @ApiMethod(name = "list")
    public Map<String, Object> list(User user) throws UnauthorizedException {
        try {
            this.userBHService.setUser(user);
            return this.userBHService.list();
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }

    @ApiMethod(name = "getRoles")
    public Map<String, Object> getRoles(User user, @Named("email") String email) throws UnauthorizedException {
        try {
            this.userBHService.setUser(user);
            return this.userBHService.getRoles(email);
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }
}