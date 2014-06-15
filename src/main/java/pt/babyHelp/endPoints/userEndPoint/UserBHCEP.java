package pt.babyHelp.endPoints.userEndPoint;


import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.HealhTec;
import pt.babyHelp.bd.Son;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.core.cloudEndpoints.EndPointError;
import pt.babyHelp.endPoints.Constants;
import pt.babyHelp.services.UserBHService;
import pt.babyHelp.services.impl.UserBHServiceImpl;

import java.util.HashMap;
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
public class UserBHCEP {

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

    @ApiMethod(name = "pendingActions", httpMethod = HttpMethod.PUT)
    public Map<String, Object> actionsPending(User user, HealthTecParams healthTecParams) throws UnauthorizedException {
        this.userBHService.setUser(user);
        return this.userBHService.pendingActions();
    }


    @ApiMethod(name = "update.healthtec", httpMethod = HttpMethod.PUT, path = "update/healthtec")
    public Map<String, Object> healthTecUpdate(User user, HealthTecParams healthTecParams) throws UnauthorizedException {

        UserFromApp userFromApp = new UserFromApp();
        userFromApp.setEmail(healthTecParams.getEmail());

        HealhTec healhTec = new HealhTec();
        healhTec.setName(healthTecParams.getName());
        healhTec.setProfession(healthTecParams.getProfession());
        userFromApp.setHealhTec(healhTec);


        BD.ofy().save().entity(userFromApp).now();
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("message", "saved");


        return map;
    }


    @ApiMethod(name = "update.sons", httpMethod = HttpMethod.PUT, path = "update/sons")
    public Map<String, Object> updateSons(User user, SonsParameters sons) throws UnauthorizedException {
        userBHService.setUser(user);
        userBHService.getAuthorization().check("declaração de filhos", Role.PARENT);
        return userBHService.setSons((Son[]) sons.getSons().toArray());
    }

    @ApiMethod(name = "pendingActions", httpMethod = ApiMethod.HttpMethod.GET, path = "pendingactions")
    public Map<String,Object> pendingActions(User user){
        userBHService.setUser(user);
        return userBHService.pendingActions();
    }


}

