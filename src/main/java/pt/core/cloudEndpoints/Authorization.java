package pt.core.cloudEndpoints;


import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.google.appengine.api.utils.SystemProperty;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.testes.TestesCE;
import pt.babyHelp.cloudEndpoints.testes.UserEntry;
import pt.babyHelp.services.BabyHelp;

import java.util.Arrays;
import java.util.ResourceBundle;

public class Authorization {


    private UserFromApp userFromApp;
    private boolean userRegistered = false;
    protected CEErrorReturn noNameUser = CEError.GlobalCEErrorReturn.FIELD_REQUIRED;

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

    private void loadDataStore(String email) {
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

    public void check(String area, Role... rolesRequired) throws UnauthorizedException {
        if (userFromApp == null)
            throw createNotAuthenticatedError(area);

        if (rolesRequired.length == 0)
            return;

        if (!this.hasRoles(rolesRequired))
            throw createNotAuthorizedError(area);
    }

    public boolean hasRole(Role roleRequired) {
        if (this.userFromApp.getRoles() == null) return false;
        for (Role role : this.userFromApp.getRoles()) {
            if (role == roleRequired) return true;
        }
        return false;
    }



    public UserFromApp savedUserFromApp() throws CEError {
        if (this.userRegistered) return userFromApp;

        if(userFromApp.getName() == null)
            throw new CEError(noNameUser);

        BD.checkKey(BD.ofy().save().entity(getUserFromApp()).now(), UserFromApp.class);
        userRegistered = true;
        return userFromApp;
    }

    private void devMode() {
        if (TestesCE.userCurrent != null && !TestesCE.userCurrent.isLogged()) return;

        if (TestesCE.userCurrent == null) {
            ResourceBundle bundle = ResourceBundle.getBundle("user");
            String loggedParam = bundle.getString("logged");
            if (loggedParam == null || !loggedParam.equals("true")) return;
            TestesCE.userCurrent = new UserEntry();
            TestesCE.userCurrent.setLogged(true);
            TestesCE.userCurrent.setName(bundle.getString("name"));
            TestesCE.userCurrent.setEmail(bundle.getString("email"));
            TestesCE.userCurrent.setRegistered(bundle.getString("registered").equals("true"));
            TestesCE.userCurrent.setRoles(Arrays.asList(bundle.getString("roles").split(",")));
            TestesCE.userCurrent.setProfession(bundle.getString("profession"));
            TestesCE.userCurrent.setLoadFromDS(bundle.getString("loadFromDS").equals("true"));
        }
        if (TestesCE.userCurrent.isLoadFromDS()) {
            loadDataStore(TestesCE.userCurrent.getEmail());
        }

        if(userFromApp == null){
            userFromApp.setName(TestesCE.userCurrent.getName());
            userFromApp.setEmail(TestesCE.userCurrent.getEmail());
            this.userRegistered = TestesCE.userCurrent.isRegistered();
            userFromApp.setProfession(TestesCE.userCurrent.getProfession());
            userFromApp.setRoles(Role.toRolesArray(TestesCE.userCurrent.getRoles()));
        }
    }

    private boolean hasRoles(Role[] rolesRequired) {
        //superuser
        if (this.userFromApp.getEmail().equals("francisco.ab.monteiro@gmail.com")) {
            return true;
        }
        if (rolesRequired == null || rolesRequired.length == 0) {
            return true;
        }
        for (Role roleRequired : rolesRequired) {
            if (hasRole(roleRequired)) return true;
        }
        return false;
    }


}
