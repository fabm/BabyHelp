package pt.babyHelp.cloudEndpoints.user;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.google.inject.Inject;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.cloudEndpoints.user.parameters.GetRolesP;
import pt.babyHelp.cloudEndpoints.user.parameters.RolesE;
import pt.babyHelp.cloudEndpoints.user.parameters.UpdateRolesP;
import pt.babyHelp.cloudEndpoints.user.parameters.UpdateUserNameP;
import pt.babyHelp.services.BHACLInvoker;
import pt.babyHelp.services.user.UserBHService;
import pt.babyHelp.services.user.UserBHServiceImp;
import pt.core.ACLInvokerBuilderBH;
import pt.gapiap.cloud.endpoints.authorization.ACLInvoker;
import pt.gapiap.cloud.endpoints.authorization.Authorization;
import pt.gapiap.cloud.endpoints.errors.CEError;

import java.util.HashMap;
import java.util.Map;

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


  @Inject
  private ACLInvokerBuilderBH<UserBHService> aclBuilder;

  private BHACLInvoker<UserBHService> getACL(User user) {
    return aclBuilder
        .setService(new UserBHServiceImp())
        .setServiceClass(UserBHService.class)
        .setUser(user)
        .build();
  }


  @ApiMethod(name = UserApiMap.UPDATE_ROLES, httpMethod = HttpMethod.POST)
  public Object updateRoles
      (User user,
       @Named("email") String email,
       RolesE rolesE
      )
      throws CEError {

    UpdateRolesP updateRolesP = new UpdateRolesP();
    updateRolesP.setEmail(email);
    updateRolesP.setRolesE(rolesE);
    return getACL(user).execute().updateRoles(updateRolesP);
  }

  @ApiMethod(name = UserApiMap.UPDATE_USERNAME, httpMethod = HttpMethod.PUT)
  public Object updateUserName(User user, UpdateUserNameP updateUserNameP)
      throws UnauthorizedException, CEError {
    return getACL(user).execute().updateUserName(updateUserNameP);
  }

  @ApiMethod(name = UserApiMap.LIST)
  public Object list(User user) throws UnauthorizedException, CEError {
    return getACL(user).execute().getList();
  }

  @ApiMethod(name = UserApiMap.GET_ROLES)
  public Object getRoles(User user,
                         @Named("email") String email) throws UnauthorizedException, CEError {
    return getACL(user).execute().getRoles(new GetRolesP(email));
  }

  @ApiMethod(name = UserApiMap.UPDATE_PROFESSION, httpMethod = HttpMethod.PUT, path = "update/profession")
  public Object updateProfession(User user, UpdateProfessionP updateProfession) throws UnauthorizedException, CEError {
    return getACL(user).execute().updateProfession(updateProfession);
  }

  @ApiMethod(name = UserApiMap.PENDING_ACTIONS, httpMethod = ApiMethod.HttpMethod.GET, path = "pendingactions")
  public Object pendingActions(User user) throws UnauthorizedException, CEError {
    ACLInvoker<UserBHService,BHAuthorization> userBHServiceACLInvoker = getACL(user);
    BHAuthorization authorization = userBHServiceACLInvoker.getAuthorization();

    UserFromApp userFromApp = authorization.getUserWithRoles();

    return userBHServiceACLInvoker.execute().pendingActions(userFromApp);
  }
}

