package pt.babyHelp.servlets;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.http.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.server.spi.ObjectMapperUtil;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.repackaged.org.codehaus.jackson.JsonNode;
import com.google.appengine.repackaged.org.codehaus.jackson.map.ObjectMapper;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.endpoints.ErrorReturn;
import pt.babyHelp.services.BabyHelpConstants;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Upload extends HttpServlet {

    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static HashMap<String, UploadAction> actionsMap;

    static {
        actionsMap = new HashMap<String, UploadAction>();
    }

    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    public static void registerAction(UploadActionCreator uploadActionCreator) {
        actionsMap.put(uploadActionCreator.getKey(), uploadActionCreator.createInstance());
    }

    private static ObjectMapper addObjectMapper(HttpServletResponse res) {
        res.setContentType("application/json");
        return ObjectMapperUtil.createStandardObjectMapper();
    }

    /**
     * Call the url, that uses a OAuth2 to get the current email user
     *
     * @param accessToken String representation of the Bearer token
     * @return current user email
     * @throws java.io.IOException
     * @throws org.apache.http.client.HttpResponseException
     */
    public static String getCurrentUserEmail(String accessToken)
            throws IOException, EndPointError {
        GenericUrl userInfo = new GenericUrl("https://www.googleapis.com/userinfo/v2/me");
        Credential credential =
                new Credential(BearerToken.authorizationHeaderAccessMethod()).setAccessToken(accessToken);
        HttpRequestFactory requestFactory = HTTP_TRANSPORT.createRequestFactory(credential);

        HttpResponse httpResponse = null;
        try {
            httpResponse = requestFactory.buildGetRequest(userInfo).execute();
        } catch (HttpResponseException e) {
            if (e.getStatusCode() == 401) throw new EndPointError(BabyHelpConstants.Error.NOT_AUTHORIZED);
        }
        ObjectMapper om = new ObjectMapper();
        JsonNode jsonNode = om.readTree(httpResponse.getContent());
        return jsonNode.get("email").toString();
    }

    private static Map<String, Object> errorMap(int code) {
        switch (code) {
            case 401:
                return errorMap("Not Authorized", code);
            case 404:
                return errorMap("Not Founded", code);
        }
        return errorMap("Not attributed", code);
    }

    private static Map<String, Object> errorMap(String message, int code) {
        Map<String, Object> mapError = new HashMap<String, Object>();
        mapError.put("code", code);
        mapError.put("message", message);
        return mapError;
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        List<String> params = UrlParameters.getParameters(req);
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            if (!params.isEmpty()) throw new EndPointError(BabyHelpConstants.Error.NOT_AUTHORIZED, "Upload");
            String token = params.get(0);
            map.put("email", getCurrentUserEmail(token));
        } catch (EndPointError endPointError) {
            map.put("error", endPointError.getMap());
        }
        addObjectMapper(res);
        //getOld(res);
    }

    private void getOld(HttpServletResponse res) throws IOException {
        ObjectMapper objectMaper = addObjectMapper(res);
        Map<String, Object> map = new HashMap<String, Object>();

        map.put("url", blobstoreService.createUploadUrl("/upload"));

        objectMaper.writeValue(res.getWriter(), map);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

        ObjectMapper objectMaper = addObjectMapper(res);
        Map<String, Object> map;


        try {
            String action = req.getParameter("action");
            if (action == null || action.isEmpty()) throw new EndPointError(Error.NO_ACTION_PARAMETER);

            String authorizationHeader = req.getHeader("Authorization");
            if (authorizationHeader == null) throw new EndPointError(Error.NO_AUTHORIZATION_BEARER);

            UploadAction uploadAction = actionsMap.get(action);

            if (uploadAction == null) throw new EndPointError(Error.NO_UPLOAD_ACTION_REGISTERED, action);

            Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
            List<BlobKey> mapFile = blobs.get("file");

            uploadAction.setContext(mapFile.get(0).getKeyString(), getCurrentUserEmail(authorizationHeader));
            map = uploadAction.getReturn();
        } catch (EndPointError endPointError) {
            map = endPointError.getMap();
        }

        objectMaper.writeValue(res.getWriter(), map);
    }


    static enum Error implements ErrorReturn {
        NO_ACTION_PARAMETER("Não foi enviado um parâmetro action", 0),
        NO_AUTHORIZATION_BEARER("Não existe o authorization header", 1),
        NO_UPLOAD_ACTION_REGISTERED("Não foi registada nenhuma acção de upload para a action:'%s'", 2);

        private String message;
        private int code;

        Error(String message, int code) {
            this.message = message;
            this.code = code;
        }

        @Override
        public String getContext() {
            return "upload";
        }

        @Override
        public int getCode() {
            return this.code;
        }

        @Override
        public String getMsg() {
            return this.message;
        }


    }
}
