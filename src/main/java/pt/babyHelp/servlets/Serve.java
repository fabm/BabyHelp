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
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;
import pt.babyHelp.bd.Foto;
import pt.babyHelp.bd.UserFromApp;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.xml.ws.http.HTTPException;
import java.io.IOException;
import java.security.NoSuchAlgorithmException;

public class Serve extends HttpServlet {
    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();


    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws IOException {

        String token = null, email;
        UserFromApp userFromApp = null;

        for (Cookie cookie : req.getCookies()) {
            res.getWriter().println("name:" + cookie.getName());
            res.getWriter().println("value:" + cookie.getValue());
            res.getWriter().println("comment:" + cookie.getComment());
            res.getWriter().println("domain:" + cookie.getDomain());
            res.getWriter().println("path:" + cookie.getPath());
            res.getWriter().println("version:" + cookie.getVersion());
            res.getWriter().println("maxAge:" + cookie.getMaxAge());
            res.getWriter().println("------------------------------------------------------------");
            if (cookie.getName().equals("bhapitoken"))
                token = cookie.getValue();
            if (cookie.getName().equals("bhapiemail")) {
                email = cookie.getValue();
                userFromApp = UserFromApp.findByEmail(email);
            }
        }

        try {
            if (userFromApp != null)
                res.getWriter().println("token corresponds:" + userFromApp.isValid(token,res));
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
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
        if (par == null) {
            return;
        }
        Foto foto = Foto.load(par);
        if (foto == null || req.getUserPrincipal() == null) {
            res.getWriter().println("Náo tem acesso à foto");
            return;
        }

        User cu = UserServiceFactory.getUserService().getCurrentUser();
        if (foto.isPublica() || foto.temAutorizacao(cu.getUserId())) {
            BlobKey blobKey = new BlobKey(req.getParameter("blob-key"));
            blobstoreService.serve(blobKey, res);
        } else {
            res.getWriter().println("Náo tem acesso à foto");
        }
    }
}
