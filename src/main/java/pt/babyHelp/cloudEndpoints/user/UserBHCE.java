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
import pt.json.proccess.Validation;

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
            (User user, @Named("email") String email,

             RolesParameters rolesParameters)
            throws UnauthorizedException {
        return UserBHService.create()
                .execute(user, UserAM.UPDATE_ROLES, email, rolesParameters);
    }

    @ApiMethod(name = "updateUserName", httpMethod = HttpMethod.PUT)
    public CEReturn updateUserName(User user, Map<String, Object> entryMap) throws UnauthorizedException {
        return UserBHService.create()
                .execute(user, UserAM.UPDATE_USERNAME, entryMap);
    }

    @ApiMethod(name = "list")
    public CEReturn list(User user) throws UnauthorizedException {
        return UserBHService.create()
                .execute(user, UserAM.LIST);
    }

    @ApiMethod(name = "getRoles")
    public CEReturn getRoles(User user,
                             @Validation.Email
                             @Named("email") String email) throws UnauthorizedException {
        return UserBHService.create()
                .execute(user, UserAM.GET_ROLES, email);
    }

    @ApiMethod(name = "update.sons", httpMethod = HttpMethod.PUT, path = "update/sons")
    public CEReturn updateSons(User user, SonsParameters sons) throws UnauthorizedException {
        return UserBHService.create()
                .execute(user, UserAM.UPDATE_SONS, sons);
    }

    @ApiMethod(name = "update.profession", httpMethod = HttpMethod.PUT, path = "update/profession")
    public CEReturn updateProfession(User user, Map<String, Object> entryMap) throws UnauthorizedException {
        return UserBHService.create()
                .execute(user, UserAM.UPDATE_PROFESSION, entryMap);
    }

    @ApiMethod(name = "pendingActions", httpMethod = ApiMethod.HttpMethod.GET, path = "pendingactions")
    public CEReturn pendingActions(User user) throws UnauthorizedException {
        return UserBHService.create()
                .execute(user, UserAM.PENDING_ACTIONS);
    }

    @ApiMethod(name = "current", httpMethod = ApiMethod.HttpMethod.GET, path = "current")
    public CEReturn current(User user) throws UnauthorizedException {
        return UserBHService.create()
                .execute(user, UserAM.CURRENT);
    }

}

