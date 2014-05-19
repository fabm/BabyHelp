package pt.babyHelp.endPoints.nextHelthTecEndPoint;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.Role;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.endpoints.EndPointReturn;
import pt.babyHelp.core.session.UserContext;
import pt.babyHelp.endPoints.Authorization;
import pt.babyHelp.endPoints.Constants;
import pt.babyHelp.services.NextHealthTecService;
import pt.babyHelp.services.impl.NextHealthTecServiceImp;

import java.util.Map;

/*
@Api(name = "nextht",
        version = "v1",
        description = "Next health technician",
        scopes = {Constants.EMAIL},
        clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID,
                Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
        audiences = {Constants.ANDROID_AUDIENCE}
)
*/
public class NextHelthTecEndPoint {
/*

    private NextHealthTecService nextHealthTecService = new NextHealthTecServiceImp();

    @ApiMethod(
            httpMethod = ApiMethod.HttpMethod.POST
    )
    public synchronized Map<String,Object> delete(User user, ParametersDeleteNHT parametersDeleteNHT)
            throws UnauthorizedException, EndPointError {
        Authorization.check(user,Role.ADMINISTRATOR);
        return nextHealthTecService.delete(parametersDeleteNHT);
    }

    @ApiMethod(
            httpMethod = ApiMethod.HttpMethod.GET
    )
    public EndPointReturn add(User user, @Named("email") String email) throws UnauthorizedException, EndPointError {
        Authorization.check(user, Role.ADMINISTRATOR);
        return nextHealthTecService.add(email);
    }

    @ApiMethod(
            httpMethod = ApiMethod.HttpMethod.GET
    )
    public EndPointReturn updateMyUser(User user) throws UnauthorizedException, EndPointError {
        Authorization.check(user);
        return nextHealthTecService.updateMyUser();
    }

    @ApiMethod(
            httpMethod = ApiMethod.HttpMethod.GET
    )
    public Map<String, Object> listPaged(
            User user,
            @Named("page") int page,
            @Named("qtPerPage") int qtPerPage,
            @Named("extraInfo") boolean extraInfo) throws UnauthorizedException {
        Authorization.check(user);
        return nextHealthTecService.listPaged(page, qtPerPage, extraInfo);
    }

    @ApiMethod(
            httpMethod = ApiMethod.HttpMethod.GET
    )
    public Map<String, Object> list(User user) throws UnauthorizedException, EndPointError {
        Authorization.check(user, Role.ADMINISTRATOR);
        return nextHealthTecService.list();
    }
*/

}

