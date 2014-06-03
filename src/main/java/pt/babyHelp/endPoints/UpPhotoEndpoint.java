package pt.babyHelp.endPoints;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.UploadToken;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.endpoints.ErrorReturn;
import pt.babyHelp.services.UserBHService;

import javax.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@Api(name = "photoToken",
        version = "v1",
        description = "Endpoint para criação de sessões para uploads de fotos BabyHelp",
        scopes = {Constants.EMAIL},
        clientIds = {Constants.WEB_CLIENT_ID, Constants.ANDROID_CLIENT_ID,
                Constants.IOS_CLIENT_ID, Constants.API_EXPLORER_CLIENT_ID},
        audiences = {Constants.ANDROID_AUDIENCE})
public class UpPhotoEndpoint {
    @ApiMethod(name = "getuploadurl", httpMethod = ApiMethod.HttpMethod.GET, path = "getuploadurl")
    public Map<String, Object> getUrl(User user, HttpServletRequest req) throws UnauthorizedException {
        try {
            if (user == null) throw new EndPointError(UserBHService.Error.NOT_AUTENTICATED);
            UploadToken uploadToken = new UploadToken();
            uploadToken.setEmail(user.getEmail());
            String authorizationHeader = req.getHeader("Authorization");
            if (authorizationHeader == null) throw new EndPointError(Error.AUTHORIZATION_MISSING);
            uploadToken.setAuthToken(authorizationHeader.substring(7));

            BD.ofy().save().entity(uploadToken).now();

            Map<String, Object> map = new HashMap<String, Object>();
            String url = BlobstoreServiceFactory.getBlobstoreService().createUploadUrl("/upload");

            map.put("url", url);
            map.put("email", user.getEmail());
            return map;
        } catch (EndPointError endPointError) {
            return endPointError.getMap();
        }
    }


    private static enum Error implements ErrorReturn {
        AUTHORIZATION_MISSING(0, "Falta o parametro de autenticação do header"),
        NOT_AUTHENTICATED(1, "Não é possível executar esta ação sem estar autenticado");

        private int code;
        private String msg;

        Error(int code, String msg) {
            this.code = code;
            this.msg = msg;
        }

        @Override
        public String getContext() {
            return "url para upload";
        }

        @Override
        public int getCode() {
            return this.code;
        }

        @Override
        public String getMsg() {
            return this.msg;
        }
    }


}
