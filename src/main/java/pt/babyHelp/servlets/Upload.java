package pt.babyHelp.servlets; /**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 13/10/13
 * Time: 23:13
 * To change this template use File | Settings | File Templates.
 */

import pt.babyHelp.bd.Foto;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class Upload extends HttpServlet {
    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    @Override
    public void doPost(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        Map<String,List<BlobKey>> blobs = blobstoreService.getUploads(req);
        List<BlobKey> blobKey = blobs.get("myFile");

        UserService userService = UserServiceFactory.getUserService();

        String thisURL = req.getRequestURI();
        Foto foto = new Foto();

        if (blobKey!=null && req.getUserPrincipal() != null) {
            foto.setBlob(blobKey.get(0).getKeyString());
            foto.setUtilizador(userService.getCurrentUser().getUserId());
            foto.save();
            res.getWriter().println("foto gravada com sucesso");
        } else {
            res.sendRedirect("/");
        }
    }
}
