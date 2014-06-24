package pt.babyHelp.cloudEndpoints.photoToken;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.User;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.cloudEndpoints.Constants;
import pt.babyHelp.services.photoToken.PhotoTokenAM;
import pt.babyHelp.services.photoToken.PhotoTokenService;
import pt.core.cloudEndpoints.Authorization;
import pt.core.cloudEndpoints.CEReturn;

import java.util.HashMap;
import java.util.Map;

@Api(name = "photoToken",
        version = "v1",
        description = "Endpoint para criação de sessões para uploads de fotos BabyHelp",
        scopes = {Constants.EMAIL},
        clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID,
                Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
        audiences = {Constants.ANDROID_AUDIENCE})
public class PhotoTokenCE {

    @ApiMethod(name = "get", httpMethod = ApiMethod.HttpMethod.GET, path = "get")
    public CEReturn get(User user) throws UnauthorizedException {
        return PhotoTokenService.create().execute(user, PhotoTokenAM.GET);
    }

}
