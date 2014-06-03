package pt.babyHelp.servlets;

import com.google.api.server.spi.ObjectMapperUtil;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.repackaged.org.codehaus.jackson.map.ObjectMapper;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
        }else
            map.put("error",errorMap);
        objectMaper.writeValue(res.getWriter(), map);
    }
}
