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
    private IndexValidator validator;

    public IndexManager() {
        super();
        init();

    }

    private void init() {
        userFromApp = UserFromApp.create();
        bundle = new BundleMap("index");

        validator = new IndexValidator();
        validator.setAdmin(userFromApp.isAdmin());

        if (UserServiceFactory.getUserService().isUserLoggedIn()) {
            User current = UserServiceFactory.getUserService().getCurrentUser();
            if (NextHealthTec.isApplyedTecSaude(current.getEmail())) {
                BD.ofy().delete().type(UserFromApp.class).id(
                        current.getUserId()
                );
            }
        }
    }

    public IndexInputs getInputs() {
        return inputs;
    }

    public BundleMap getBundle() {
        return bundle;
    }

    @Override
    protected IndexInputs getNewIputsInstance() {
        return new IndexInputs();
    }

    @Override
    protected void problemInReflectionsCall(Exception ex) {
        validator.setReflectionProblem(true);
    }

    private boolean validatingEmail() {
        if (inputs.getMail().isEmpty()) {
            validator.setMailEmpty(true);
            return false;
        }

        EmailValidator emailValidator = new EmailValidator();
        if (!emailValidator.validate(inputs.getMail())) {
            validator.setMailMalformed(true);
            return false;
        }

        try {
            NextHealthTec.setNext(inputs.getMail());
            validator.setMailAlreadyExists(false);
        } catch (IllegalArgumentException iaa) {
            validator.setMailAlreadyExists(true);
            return false;
        }
        inputs.setMail(null);
        return true;
    }

    @Override
    public boolean pageValidatation() {

        boolean emailValid = validatingEmail();


        return emailValid;
    }

    @Override
    public void afterValidatation() {
        iteratorNextHealthTec = new IteratorNextHealthTec();
        validator.setItNextHealthTecHasRows(iteratorNextHealthTec.hasNext());

        iteratorUserFromApp = new IteratorUserFromApp();
        validator.setItUserFromAppHasRows(iteratorUserFromApp.hasNext());
    }

    @Override
    public void postRendering() {
        Map<String, List<?>> idsList = getIDsList();
        idsList.put("idsFromNextHealthTec", iteratorNextHealthTec.getIDsList());
        idsList.put("idsFromUserFromApp", iteratorUserFromApp.getIDsList());
        super.postRendering();
    }

    public IteratorNextHealthTec getIteratorNextHealthTec() {
        return iteratorNextHealthTec;
    }

    public IteratorUserFromApp getIteratorUserFromApp() {
        return iteratorUserFromApp;
    }

    public IndexValidator getValidator() {
        return validator;
    }

    public String getAlertAfterInsertion() {
        return MessageFormat.format(getBundle().get("alertAfterInsertion"), getInputs().getMail());
    }

}
