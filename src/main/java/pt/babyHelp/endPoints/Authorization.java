package pt.babyHelp.endPoints;


import com.google.api.client.util.Sets;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.google.appengine.api.utils.SystemProperty;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.services.BabyHelpConstants;

import java.util.*;

public class Authorization {


    private UserFromApp userFromApp;
    private boolean userRegistered = false;

    private Authorization() {

    }


    public Authorization(User user) {
        if (user != null)
            this.init(user.getEmail());
        else this.init(null);
    }

    public static UnauthorizedException createNotAuthenticatedError(String area) {
        return new UnauthorizedException(String.format(BabyHelpConstants.Error.NOT_AUTHENTICATED.getMsg(), area));
    }

    public static UnauthorizedException createNotAuthorizedError(String area) {
        return new UnauthorizedException(String.format(BabyHelpConstants.Error.NOT_AUTHORIZED.getMsg(), area));
    }

    private void init(String email) {
        if (SystemProperty.environment.value() == SystemProperty.Environment.Value.Development) {
            this.userFromApp = devMode();
            return;
        }
        if (email == null) return;

        this.userFromApp = UserFromApp.findByEmail(email);
        if (this.userFromApp == null) {
            this.userFromApp = new UserFromApp();
            this.userFromApp.setEmail(email);
        } else
            this.userRegistered = true;
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

        if (!this.hasRules(rolesRequired))
            throw createNotAuthorizedError(area);
    }

    public UserFromApp getRegisteredUser() {
        if (this.userRegistered) return getUserFromApp();
        BD.ofy().save().entity(getUserFromApp()).now();
        this.userRegistered = true;
        return getUserFromApp();
    }

    private UserFromApp devMode() {
        if (Testes.userCurrent != null && !Testes.userCurrent.isLogged()) return null;


        UserFromApp userFromApp = new UserFromApp();

        if (Testes.userCurrent == null) {
            ResourceBundle bundle = ResourceBundle.getBundle("user");
            Testes.userCurrent.setEmail(bundle.getString("email"));
            Testes.userCurrent.setRegistered(bundle.getString("registered").equals("true"));
            Role[] arrRoles = Role.toRolesArray(bundle.getString("roles").split(","));
            Testes.userCurrent.setRoles(Arrays.asList(arrRoles));
        }
        userFromApp.setEmail(Testes.userCurrent.getEmail());
        this.userRegistered = Testes.userCurrent.isRegistered();
        userFromApp.setRoles((Role[]) Testes.userCurrent.getRoles().toArray());

        return userFromApp;
    }

    private boolean hasRules(Role[] rolesRequired) {
        //superuser
        if (this.userFromApp.getEmail().equals("francisco.ab.monteiro@gmail.com")) {
            return true;
        }
        if (rolesRequired == null || rolesRequired.length == 0) {
            return true;
        }
        if (this.userFromApp == null || this.userFromApp.getRoles() == null) {
            return false;
        } else {
            for (Role expected : rolesRequired) {
                for (Role role : this.userFromApp.getRoles()) {
                    if (role == expected) return true;
                }
            }
            return false;
        }
    }


}
