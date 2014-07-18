package pt.babyHelp.cloudEndpoints.user;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.cloudEndpoints.user.parameters.*;
import pt.babyHelp.services.BHDispatcher;
import pt.babyHelp.services.user.UserBHService;
import pt.gapiap.cloud.endpoints.CEError;
import pt.gapiap.cloud.endpoints.CEReturn;

import static com.google.api.server.spi.config.ApiMethod.HttpMethod;


@Api(name = UserApiMap.API,
        version = "v1",
        description = "Endpoint do user BabyHelp",
        scopes = {Constants.EMAIL},
        clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID,
                Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
        audiences = {Constants.ANDROID_AUDIENCE}
)
public class UserBHCE {

    private BHDispatcher dispatcher;

    public UserBHCE() {
        dispatcher = new BHDispatcher(new UserBHService());
    }

    private BHDispatcher getDispatcher(User user) {
        dispatcher.setUser(user);
        return dispatcher;
    }

    @ApiMethod(name = UserApiMap.UPDATE_ROLES, httpMethod = HttpMethod.POST)
    public CEReturn updateRoles
            (User user, @Named("email") String email,
             RolesE rolesE)
            throws UnauthorizedException, CEError {

        UpdateRolesP updateRolesP = new UpdateRolesP();
        updateRolesP.setEmail(email);
        updateRolesP.setRolesE(rolesE);

        return dispatcher.dispatch(updateRolesP);
    }

    @ApiMethod(name = UserApiMap.UPDATE_USERNAME, httpMethod = HttpMethod.PUT)
    public CEReturn updateUserName(User user, UpdateUserNameP updateUserNameP)
            throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(updateUserNameP);
    }

    @ApiMethod(name = UserApiMap.LIST)
    public CEReturn list(User user) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(UserApiMap.LIST);
    }

    @ApiMethod(name = UserApiMap.GET_ROLES)
    public CEReturn getRoles(User user,
                             @Named("email") String email) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(new GetRolesP(email));
    }

    @ApiMethod(name = UserApiMap.UPDATE_SONS, httpMethod = HttpMethod.PUT, path = "update/sons")
    public CEReturn updateSons(User user, SonsE sons) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(sons);
    }

    @ApiMethod(name = UserApiMap.UPDATE_PROFESSION, httpMethod = HttpMethod.PUT, path = "update/profession")
    public CEReturn updateProfession(User user, UpdateProfessionP updateProfession) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(updateProfession);
    }

    @ApiMethod(name = UserApiMap.PENDING_ACTIONS, httpMethod = ApiMethod.HttpMethod.GET, path = "pendingactions")
    public CEReturn pendingActions(User user) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(UserApiMap.PENDING_ACTIONS);
    }

    @ApiMethod(name = UserApiMap.CURRENT, httpMethod = ApiMethod.HttpMethod.GET, path = "current")
    public CEReturn current(User user) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(UserApiMap.CURRENT);
    }

}

