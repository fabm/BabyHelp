package pt.babyHelp.servlets; /**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 13/10/13
 * Time: 23:13
 * To change this template use File | Settings | File Templates.
 */

import com.google.api.client.repackaged.org.apache.commons.codec.binary.Base64;
import com.google.api.server.spi.ObjectMapperUtil;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;
import com.google.appengine.api.utils.SystemProperty;
import com.google.appengine.repackaged.org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

public class Upload extends HttpServlet {

    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    private static ObjectMapper addObjectMapper(HttpServletResponse res) {
        res.setContentType("application/json");
        return ObjectMapperUtil.createStandardObjectMapper();
    }

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        ObjectMapper objectMaper = addObjectMapper(res);
        Map<String, Object> map = new HashMap<String, Object>();

        boolean devEnvironment = true;
        //SystemProperty.environment.value() == SystemProperty.Environment.Value.Development;


        //ver se é possivel http-only no cookie

        if (devEnvironment || req.getSession().getAttribute("userFromApp") != null) {
            map.put("url", blobstoreService.createUploadUrl("/upload"));
        } else {
            Map<String, Object> mapError = new HashMap<String, Object>();
            mapError.put("code", 401);
            mapError.put("message", "Unauthorized");
            map.put("error", mapError);
        }

        objectMaper.writeValue(res.getWriter(), map);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        User user = UserServiceFactory.getUserService().getCurrentUser();
        ObjectMapper objectMaper = addObjectMapper(res);
        Map<String, Object> map = new HashMap<String, Object>();

        Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
        List<BlobKey> mapFile = blobs.get("file");

        map.put("host", req.getLocalName());
        map.put("pathInfo", req.getPathInfo());
        map.put("contextPath", req.getContextPath());
        Map<String, Object> mapCookies = new HashMap<String, Object>();
        for (Cookie cookie : req.getCookies())
            mapCookies.put(cookie.getName(), cookie.getValue());
        map.put("cookies", mapCookies);
        if (user == null)
            map.put("user", "nulo");
        else
            map.put("user", user.getEmail());

        map.put("imagekey", mapFile.get(0).getKeyString());
        objectMaper.writeValue(res.getWriter(), map);
    }
}
