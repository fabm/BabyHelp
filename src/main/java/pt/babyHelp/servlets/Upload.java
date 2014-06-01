package pt.babyHelp.servlets; /**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 13/10/13
 * Time: 23:13
 * To change this template use File | Settings | File Templates.
 */

import com.google.api.server.spi.ObjectMapperUtil;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.utils.SystemProperty;
import com.google.appengine.repackaged.org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

public class Upload extends HttpServlet {

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        res.setContentType("application/json");
        Map<String, Object> map = new HashMap<String, Object>();
        ObjectMapper objectMaper = ObjectMapperUtil.createStandardObjectMapper();


        boolean devEnvironment = SystemProperty.environment.value() == SystemProperty.Environment.Value.Development;

        if (devEnvironment || req.getSession().getAttribute("userFromApp") != null) {
            BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();
            map.put("url", blobstoreService.createUploadUrl("/upload"));
        }
        else{
            Map<String,Object> mapError = new HashMap<String, Object>();
            mapError.put("code",401);
            mapError.put("message","Unauthorized");
            map.put("error",mapError);
        }

        objectMaper.writeValue(res.getWriter(), map);
    }

}
