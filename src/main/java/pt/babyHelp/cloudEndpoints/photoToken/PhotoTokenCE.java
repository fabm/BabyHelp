package pt.babyHelp.cloudEndpoints.photoToken;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.google.inject.Inject;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.services.BHACLInvoker;
import pt.babyHelp.services.photoToken.PhotoTokenApiMap;
import pt.babyHelp.services.photoToken.PhotoTokenService;
import pt.babyHelp.services.photoToken.PhotoTokenServiceImp;
import pt.gapiap.cloud.endpoints.authorization.ACLInvoker;
import pt.gapiap.cloud.endpoints.errors.CEError;

@Api(name = PhotoTokenApiMap.API,
        version = "v1",
        description = "Endpoint para criação de sessões para uploads de fotos BabyHelp",
        scopes = {Constants.EMAIL},
        clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID,
                Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
        audiences = {Constants.ANDROID_AUDIENCE})
public class PhotoTokenCE {


    BHACLInvoker<PhotoTokenService> getACL(User user){
        return null;
    }

    @ApiMethod(name = PhotoTokenApiMap.GET, httpMethod = ApiMethod.HttpMethod.GET, path = "get")
    public Object get(User user) throws UnauthorizedException, CEError {
        return getACL(user).execute().getToken();
    }

}
