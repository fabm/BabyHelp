package pt.babyHelp.cloudEndpoints.user;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.services.user.UserAM;
import pt.babyHelp.services.user.UserBHService;
import pt.core.cloudEndpoints.CEReturn;
import pt.core.cloudEndpoints.services.CEService;

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
public class UserBHCE {

    @ApiMethod(name = "updateRoles", httpMethod = HttpMethod.POST)
    public CEReturn updateRoles
            (User user, @Named("email") String email, RolesParameters rolesParameters)
            throws UnauthorizedException {
        CEService<UserAM> userBHService = new UserBHService();
        userBHService.execute(user, UserAM.UPDATE_ROLES, email, rolesParameters);
        return userBHService;
    }

    @ApiMethod(name = "updateUserName", httpMethod = HttpMethod.PUT)
    public CEReturn updateUserName(User user, final Map<String, Object> entryMap) throws UnauthorizedException {
        CEService<UserAM> userBHService = new UserBHService();
        userBHService.execute(user, UserAM.UPDATE_USERNAME, entryMap);
        return userBHService;
    }

    @ApiMethod(name = "list")
    public CEReturn list(User user) throws UnauthorizedException {
        CEService<UserAM> userBHService = new UserBHService();
        userBHService.execute(user, UserAM.LIST);
        return userBHService;
    }

    @ApiMethod(name = "getRoles")
    public CEReturn getRoles(User user, @Named("email") String email) throws UnauthorizedException {
        CEService<UserAM> userBHService = new UserBHService();
        userBHService.execute(user,UserAM.GET_ROLES,email);
        return userBHService;
    }

    @ApiMethod(name = "update.sons", httpMethod = HttpMethod.PUT, path = "update/sons")
    public CEReturn updateSons(User user, SonsParameters sons) throws UnauthorizedException {
        CEService<UserAM> userBHService = new UserBHService();
        userBHService.execute(user, UserAM.UPDATE_SONS, sons);
        return userBHService;
    }

    @ApiMethod(name = "update.profession", httpMethod = HttpMethod.PUT, path = "update/profession")
    public CEReturn updateProfession(User user, final Map<String, Object> entryMap) throws UnauthorizedException {
        CEService<UserAM> userBHService = new UserBHService();
        userBHService.execute(user, UserAM.UPDATE_PROFESSION, entryMap);
        return userBHService;
    }

    @ApiMethod(name = "pendingActions", httpMethod = ApiMethod.HttpMethod.GET, path = "pendingactions")
    public CEService<UserAM> pendingActions(User user) throws UnauthorizedException {
        CEService<UserAM> userBHService = new UserBHService();
        userBHService.execute(user,UserAM.PENDING_ACTIONS);
        return userBHService;
    }

    @ApiMethod(name = "current", httpMethod = ApiMethod.HttpMethod.GET, path = "current")
    public CEService<UserAM> current(User user) throws UnauthorizedException {
        CEService<UserAM> userBHService = new UserBHService();
        userBHService.execute(user,UserAM.CURRENT);
        return userBHService;
    }

}

