package pt.babyHelp.servlets; /**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 13/10/13
 * Time: 23:14
 * To change this template use File | Settings | File Templates.
 */

import pt.babyHelp.bd.Foto;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

public class Serve extends HttpServlet {
    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();


    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
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
