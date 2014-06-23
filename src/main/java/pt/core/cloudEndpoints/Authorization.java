package pt.core.cloudEndpoints;


import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.google.appengine.api.utils.SystemProperty;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.services.BabyHelp;
import pt.core.cloudEndpoints.services.CEActionMap;

public abstract class Authorization<T extends Enum<T>> {

    protected CEErrorReturn noNameUser = CEError.GlobalCEErrorReturn.FIELD_REQUIRED;
    protected UserFromApp<T> userFromApp;
    protected boolean userRegistered = false;

    private Authorization() {

    }


    public Authorization(User user) {
        if (user != null)
            this.init(user);
        else this.init(null);
    }

    public static UnauthorizedException createNotAuthenticatedError(String area) {
        return new UnauthorizedException(String.format(BabyHelp.CEError.NOT_AUTHENTICATED.getMsg(), area));
    }

    public static UnauthorizedException createNotAuthorizedError(String area) {
        return new UnauthorizedException(String.format(BabyHelp.CEError.NOT_AUTHORIZED.getMsg(), area));
    }

    public static void checkDevMode() {
        if (SystemProperty.Environment.Value.Development != SystemProperty.Environment.Value.Development)
            createNotAuthenticatedError("Área apenas premitida em devmode");
    }

    protected void loadDataStore(String email) {
        this.userFromApp = UserFromApp.findByEmail(email);
        if (this.userFromApp == null) {
            this.userFromApp = new UserFromApp();
            this.userFromApp.setEmail(email);
        } else
            this.userRegistered = true;
    }

    private void init(User user) {
        if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development) {
            devMode();
            return;
        }
        if (user == null) return;
        loadDataStore(user.getEmail());
    }

    public UserFromApp getUserFromApp() {
        return userFromApp;
    }

    public boolean isUserRegistered() {
        return userRegistered;
    }

    public void check(String area, T... rolesRequired) throws UnauthorizedException {
        if (userFromApp == null)
            throw createNotAuthenticatedError(area);

        if (rolesRequired.length == 0)
            return;

        if (!this.hasRoles(rolesRequired))
            throw createNotAuthorizedError(area);
    }

    @SuppressWarnings("unchecked")
    public void check(CEActionMap<T, ?> ceActionMap) throws UnauthorizedException {
        if(ceActionMap == null) return;
        if (ceActionMap.autenticationRequired())
            check(ceActionMap.getArea(), ceActionMap.getRoles());
    }

    public boolean hasRole(T roleRequired) {
        if (this.userFromApp.getRoles() == null) return false;
        for (T role : this.userFromApp.getRoles()) {
            if (role == roleRequired) return true;
        }
        return false;
    }


    public UserFromApp savedUserFromApp() throws CEError {
        if (this.userRegistered) return userFromApp;

        if (userFromApp.getName() == null)
            throw new CEError(noNameUser);

        BD.checkKey(BD.ofy().save().entity(getUserFromApp()).now(), UserFromApp.class);
        userRegistered = true;
        return userFromApp;
    }

    protected abstract void devMode();

    private boolean hasRoles(T[] rolesRequired) {
        //superuser
        if (this.userFromApp.getEmail().equals("francisco.ab.monteiro@gmail.com")) {
            return true;
        }
        if (rolesRequired == null || rolesRequired.length == 0) {
            return true;
        }
        for (T roleRequired : rolesRequired) {
            if (hasRole(roleRequired)) return true;
        }
        return false;
    }


}
