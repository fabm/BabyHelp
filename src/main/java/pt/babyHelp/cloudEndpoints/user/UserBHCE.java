package pt.babyHelp.cloudEndpoints.user;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.Son;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.services.UserBHService;
import pt.babyHelp.services.impl.UserBHServiceImpl;
import pt.core.cloudEndpoints.CEError;
import pt.core.cloudEndpoints.CEReturn;
import pt.core.cloudEndpoints.CEUtils;

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

    private UserBHService userBHService = new UserBHServiceImpl();


    @ApiMethod(name = "updateRoles", httpMethod = HttpMethod.POST)
    public Map<String, Object> updateRoles
            (User user, @Named("email") String email, RolesParameters rolesParameters)
            throws UnauthorizedException {
        try {
            this.userBHService.setUser(user);
            return this.userBHService.updateRoles(email, rolesParameters);
        } catch (CEError CEError) {
            return CEError.getMap();
        }
    }

    @ApiMethod(name = "updateUserName", httpMethod = HttpMethod.PUT)
    public CEReturn updateUserName(User user, final Map<String, Object> entryMap) throws UnauthorizedException {
        this.userBHService.setUser(user);
        return new CEReturn() {
            @Override
            public Object getCEResponse() throws CEError {
                return userBHService.updateUserName(entryMap);
            }
        };
    }

    @ApiMethod(name = "list")
    public Map<String, Object> list(User user) throws UnauthorizedException {
        try {
            this.userBHService.setUser(user);
            return this.userBHService.list();
        } catch (CEError CEError) {
            return CEError.getMap();
        }
    }

    @ApiMethod(name = "getRoles")
    public Map<String, Object> getRoles(User user, @Named("email") String email) throws UnauthorizedException {
        try {
            this.userBHService.setUser(user);
            return this.userBHService.getRoles(email);
        } catch (CEError CEError) {
            return CEError.getMap();
        }
    }

    @ApiMethod(name = "update.sons", httpMethod = HttpMethod.PUT, path = "update/sons")
    public Map<String, Object> updateSons(User user, SonsParameters sons) throws UnauthorizedException {
        userBHService.setUser(user);
        userBHService.getAuthorization().check("declaração de filhos", Role.PARENT);
        return userBHService.setSons((Son[]) sons.getSons().toArray());
    }

    @ApiMethod(name = "update.healthtec", httpMethod = HttpMethod.PUT, path = "update/healthtec")
    public CEReturn updateHealthTec(User user, final Map<String, Object> entryMap) {
        this.userBHService.setUser(user);
        return new CEReturn() {
            @Override
            public Object getCEResponse() throws CEError {
                return userBHService.updateHealthTec(entryMap);
            }
        };
    }

    @ApiMethod(name = "pendingActions", httpMethod = ApiMethod.HttpMethod.GET, path = "pendingactions")
    public Map<String, Object> pendingActions(User user) {
        userBHService.setUser(user);
        return userBHService.pendingActions();
    }

    @ApiMethod(name = "current", httpMethod = ApiMethod.HttpMethod.GET, path = "current")
    public Map<String, Object> current(User user) {
        userBHService.setUser(user);
        Map<String, Object> map = CEUtils.createMapAndPut("email",
                userBHService.getAuthorization().getUserFromApp().getEmail());
        if (userBHService.getAuthorization().getUserFromApp().getProfession() != null) {
            map.put("profissao", userBHService.getAuthorization().getUserFromApp().getProfession());
        }
        return map;
    }

}
