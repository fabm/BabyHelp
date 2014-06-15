package pt.babyHelp.endPoints;

import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.User;
import pt.babyHelp.core.cloudEndpoints.ErrorReturn;

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
    Authorization authorization;




    @ApiMethod(name = "getuploadurl", httpMethod = ApiMethod.HttpMethod.GET, path = "getuploadurl")
    public Map<String, Object> getUrl(User user) throws UnauthorizedException {
        authorization = new Authorization(user);
        return delegate();
    }

    private Map<String, Object> delegate() throws UnauthorizedException {
        authorization.check("pedido de url para upload");


        Map<String, Object> map = new HashMap<String, Object>();
        String url = BlobstoreServiceFactory.getBlobstoreService().createUploadUrl("/upload");

        map.put("url", url);
        map.put("email", authorization.getUserFromApp().getEmail());
        return map;
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
