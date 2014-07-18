package pt.babyHelp.cloudEndpoints.photoToken;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.services.BHDispatcher;
import pt.babyHelp.services.photoToken.PhotoTokenApiMap;
import pt.babyHelp.services.photoToken.PhotoTokenService;
import pt.gapiap.cloud.endpoints.CEError;
import pt.gapiap.cloud.endpoints.CEReturn;

@Api(name = PhotoTokenApiMap.API,
        version = "v1",
        description = "Endpoint para criação de sessões para uploads de fotos BabyHelp",
        scopes = {Constants.EMAIL},
        clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID,
                Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
        audiences = {Constants.ANDROID_AUDIENCE})
public class PhotoTokenCE {

    private BHDispatcher dispatcher;

    public PhotoTokenCE() {
        dispatcher = new BHDispatcher(new PhotoTokenService());
    }

    private BHDispatcher getDispatcher(User user) {
        dispatcher.setUser(user);
        return dispatcher;
    }

    @ApiMethod(name = PhotoTokenApiMap.GET, httpMethod = ApiMethod.HttpMethod.GET, path = "get")
    public CEReturn get(User user) throws UnauthorizedException, CEError {
        return getDispatcher(user).dispatch(PhotoTokenApiMap.GET);
    }

}
