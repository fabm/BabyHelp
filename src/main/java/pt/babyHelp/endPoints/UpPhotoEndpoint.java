package pt.babyHelp.endPoints;

import com.google.api.client.http.HttpHeaders;
import com.google.api.client.http.HttpRequest;
import com.google.api.server.spi.config.Api;
import com.google.api.server.spi.config.ApiMethod;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.UploadToken;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.session.UserContext;
import pt.babyHelp.services.UserBHService;

import javax.servlet.http.HttpServletRequest;
import java.util.Enumeration;
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


    @ApiMethod(name = "geturl", httpMethod = ApiMethod.HttpMethod.GET, path = "geturl")
    public Map<String,Object> getUrl(User user,HttpServletRequest req) throws UnauthorizedException {

        if(user == null) throw new UnauthorizedException("Sem autorização");
        UploadToken uploadToken = new UploadToken();
        uploadToken.setEmail(user.getEmail());
        uploadToken.setAuthToken(req.getHeader("Authorization").substring(7));

        BD.ofy().save().entity(uploadToken).now();

        Map<String,Object> map = new HashMap<String, Object>();
        String url = BlobstoreServiceFactory.getBlobstoreService().createUploadUrl("/upload");

        map.put("url",url);
        printToken(req);
        return map;
    }

    private void printToken(HttpServletRequest req){
        Enumeration hn = req.getHeaderNames();
        while (hn.hasMoreElements()){
            String name = hn.nextElement().toString();
            System.out.println(name+":"+req.getHeader(name));

        }
    }

}
