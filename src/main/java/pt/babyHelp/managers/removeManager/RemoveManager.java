package pt.babyHelp.managers.removeManager;

import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.NextHealthTec;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bundle.BundleMap;
import pt.babyHelp.core.Manager;

import java.text.MessageFormat;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 08/12/13
 * Time: 21:15
 * To change this template use File | Settings | File Templates.
 */
public class RemoveManager extends Manager<RemoveInputs> {
    private BundleMap bundle;
    private RemoveValidator removeValidator;
    private String email;

    public RemoveManager() {
        removeValidator = new RemoveValidator();
        bundle = new BundleMap("removeUser");
    }

    public BundleMap getBundle() {
        return bundle;
    }

    public RemoveValidator getRemoveValidator() {
        return removeValidator;
    }

    public boolean isWithoutRequests() {
        return !super.hasRequests();
    }

    @Override
    protected RemoveInputs getNewIputsInstance() {
        return new RemoveInputs();
    }

    @Override
    protected void problemInReflectionsCall(Exception ex) {
        throw new RuntimeException("Problem with reflection");
    }

    @Override
    public boolean pageValidatation() {
        removeValidator.setAdmin(UserFromApp.create().isAdmin());
        removeValidator.setIdEmpty(inputs.getId().isEmpty());
        removeValidator.setTypeEmpty(inputs.getType().isEmpty());
        boolean typeUserFromApp = false;

        if (inputs.getType().equals("0"))
            typeUserFromApp = true;
        else if (inputs.getType().equals("1"))
            typeUserFromApp = false;
        else
            removeValidator.setTypeInvalid(true);

        if (removeValidator.isTypeInvalid() || removeValidator.isIdEmpty() || removeValidator.isTypeEmpty())
            return false;

        Map<String, List<?>> map = getIDsList();
        List<?> idsFromNextHealthTec = map.get("idsFromNextHealthTec");
        List<?> idsFromUserFromApp = map.get("idsFromUserFromApp");

        Long id = null;

        if (typeUserFromApp) {
            try {
                id = (Long) idsFromUserFromApp.get(Integer.parseInt(inputs.getId()));
            } catch (NumberFormatException nfe) {
                removeValidator.setIdInvalid(true);
            }
            UserFromApp userFromApp = BD.ofy().load().type(UserFromApp.class).id(id).now();
            removeValidator.setUserFromAppDoesntExists(userFromApp == null);
            if (userFromApp != null) {
                email = userFromApp.getEmail();
            }
        } else {
            try {
                id = (Long) idsFromNextHealthTec.get(Integer.parseInt(inputs.getId()));
            } catch (NumberFormatException nfe) {
                removeValidator.setIdInvalid(true);
            }
            NextHealthTec nextHealthTec = BD.ofy().load().type(NextHealthTec.class).id(id).now();
            removeValidator.setNextHealthTecDoesntExists(nextHealthTec == null);
            if (nextHealthTec != null) {
                email = nextHealthTec.getEmail();
            }
        }
        if (removeValidator.isNextHealthTecDoesntExists() || removeValidator.isUserFromAppDoesntExists()) {
            return false;
        }

        if (typeUserFromApp)
            BD.ofy().delete().type(UserFromApp.class).id(id);
        else
            BD.ofy().delete().type(NextHealthTec.class).id(id);

        return true;
    }

    @Override
    public void afterValidatation() {
        //there is no need to implement this method
    }

    public String getRoleUpdatedMSG() {
        return MessageFormat.format(getBundle().get("roleUpdated"), email);
    }

}
