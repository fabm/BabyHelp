package pt.babyHelp.servlets; /**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 13/10/13
 * Time: 23:13
 * To change this template use File | Settings | File Templates.
 */

import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import pt.babyHelp.bd.Photo;
import pt.babyHelp.bd.PersistenceException;

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



        Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
        List<BlobKey> blobKey = blobs.get("myFile");

        UserService userService = UserServiceFactory.getUserService();

        String thisURL = req.getRequestURI();
        Photo photo = new Photo();

        if (blobKey != null && req.getUserPrincipal() != null) {
            photo.setBlob(blobKey.get(0).getKeyString());
            try {
                photo.save();
                res.getWriter().println("foto gravada com sucesso");
            } catch (PersistenceException e) {
                res.getWriter().println("ocorreu um erro ao tentar gravar a foto");
            }
        } else {
            res.sendRedirect("/");
        }
    }
}
