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
import pt.babyHelp.bd.UserFromApp;

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
        Object attr = req.getSession().getAttribute("currentUser");
        if (attr != null) {
            UserFromApp userFromApp = (UserFromApp) attr;
            res.getWriter().println(userFromApp.getEmail());
        } else {
            res.getWriter().println("nulo");
        }


        for (Object par : UrlParameters.getParameters(req))
            res.getWriter().println(par);
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
        String par = req.getParameter("blob-key");
        BlobKey blobKey = new BlobKey(req.getParameter("blob-key"));
        blobstoreService.serve(blobKey, res);
    }
}
