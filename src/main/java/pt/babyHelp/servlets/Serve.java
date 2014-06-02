package pt.babyHelp.servlets; /**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 13/10/13
 * Time: 23:14
 * To change this template use File | Settings | File Templates.
 */

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.ws.http.HTTPException;
import java.io.IOException;

public class Serve extends HttpServlet {
    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();


    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {


        doPhoto(req,res);
    }

    private Cookie getCoockie(HttpServletRequest req, String name) {
        for (Cookie cookie : req.getCookies()) {
            if (cookie.getName().equals(name))
                return cookie;
        }
        return null;
    }

    private void auth(HttpServletRequest req) {
        String token = getToken(req);
        if (token == null)
            throw new HTTPException(404);
    }

    private String getToken(HttpServletRequest req) {
        for (Cookie cookie : req.getCookies()) {
            if (cookie.getName().equals("bhapitoken"))
                return cookie.getValue();
        }
        return null;
    }

    public void doPhoto(HttpServletRequest req, HttpServletResponse res)
            throws IOException {
        BlobKey blobKey = new BlobKey(UrlParameters.getParameters(req).get(0));
        blobstoreService.serve(blobKey, res);
    }
}
