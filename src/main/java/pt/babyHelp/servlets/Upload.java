package pt.babyHelp.servlets;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.IOUtils;
import com.google.api.server.spi.ObjectMapperUtil;
import com.google.api.services.plus.Plus;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.repackaged.org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.StringReader;
import java.io.StringWriter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Upload extends HttpServlet {

    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static final JsonFactory JSON_FACTORY = new JacksonFactory();
    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    private static ObjectMapper addObjectMapper(HttpServletResponse res) {
        res.setContentType("application/json");
        return ObjectMapperUtil.createStandardObjectMapper();
    }

    public static HttpResponse executeGet(
            HttpTransport transport, JsonFactory jsonFactory, String accessToken, GenericUrl url)
            throws IOException {
        Credential credential =
                new Credential(BearerToken.authorizationHeaderAccessMethod()).setAccessToken(accessToken);
        HttpRequestFactory requestFactory = transport.createRequestFactory(credential);
        return requestFactory.buildGetRequest(url).execute();
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        List<String> params = UrlParameters.getParameters(req);
        if (!params.isEmpty()) {
            String token = params.get(0);
            GenericUrl plusMe = new GenericUrl("https://www.googleapis.com/plus/v1/people/me");

            HttpResponse r = executeGet(HTTP_TRANSPORT, JSON_FACTORY, token, plusMe);
            IOUtils.copy(r.getContent(),res.getOutputStream());
            return;
        }

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

        String authorizationHeader = req.getHeader("Authorization");
        String email = req.getParameter("email");

        Map<String, Object> map = new HashMap<String, Object>();

        Map<String, Object> errorMap = null;

        if (authorizationHeader == null) {
            if (errorMap == null)
                errorMap = new HashMap<String, Object>();
            errorMap.put("code", 0);
            errorMap.put("message", "Não existe o authorization header");
        }
        if (email == null) {
            if (errorMap == null)
                errorMap = new HashMap<String, Object>();
            errorMap.put("code", 1);
            errorMap.put("message", "O parametro email é obrigatório");
        }

        if (errorMap == null) {
            Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
            List<BlobKey> mapFile = blobs.get("file");

            map.put("imagekey", mapFile.get(0).getKeyString());
        } else
            map.put("error", errorMap);
        objectMaper.writeValue(res.getWriter(), map);
    }
}
