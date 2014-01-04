package pt.babyHelp.managers.index;

import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.NextHealthTec;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bundle.BundleMap;
import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;
import pt.babyHelp.core.Manager;
import pt.babyHelp.managers.index.iterators.IteratorNextHealthTec;
import pt.babyHelp.managers.index.iterators.IteratorUserFromApp;
import pt.babyHelp.utils.EmailValidator;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 30/11/13
 * Time: 23:07
 * To change this template use File | Settings | File Templates.
 */
public class IndexManager extends Manager<IndexInputs> {
    private UserFromApp userFromApp;
    private BundleMap bundle;
    private IteratorNextHealthTec iteratorNextHealthTec;
    private IteratorUserFromApp iteratorUserFromApp;

    public IndexManager() {
        super();
        init();

    }

    private void init() {
        userFromApp = UserFromApp.create();
        bundle = new BundleMap("index");


        if (UserServiceFactory.getUserService().isUserLoggedIn()) {
            User current = UserServiceFactory.getUserService().getCurrentUser();
            if (NextHealthTec.isApplyedTecSaude(current.getEmail())) {
                BD.ofy().delete().type(UserFromApp.class).id(
                        current.getUserId()
                );
            }
        }
    }

    public BundleMap getBundle() {
        return bundle;
    }

    @Override
    protected void problemInReflectionsCall(Exception ex) {
    }


    @Override
    public void afterCatch() {

        //TODO criar a validação dos iteradores
    }

    @Override
    public IndexInputs createInputContainer() {
        return new IndexInputs();
    }

    @Override
    public void postRendering() {
        Map<String, List<?>> idsList = getIDsList();
        idsList.put("idsFromNextHealthTec", iteratorNextHealthTec.getIDsList());
        idsList.put("idsFromUserFromApp", iteratorUserFromApp.getIDsList());
    }

    public IteratorNextHealthTec getIteratorNextHealthTec() {
        return iteratorNextHealthTec;
    }

    public IteratorUserFromApp getIteratorUserFromApp() {
        return iteratorUserFromApp;
    }

}
