package pt.babyHelp.endPoints;


import com.google.api.server.spi.response.UnauthorizedException;
import pt.babyHelp.bd.Role;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.services.BabyHelpConstants;

public class Authorization {


    public static UserFromApp check(String email, String area, Role... roles) throws UnauthorizedException {
        UserFromApp userFromApp = UserFromApp.findByEmail(email);

        if(userFromApp == null)
            throw new UnauthorizedException(String.format(BabyHelpConstants.Error.NOT_AUTHENTICATED.getMsg(),area));

        if(roles.length==0)
            return userFromApp;

        if(!Authorization.hasRules(userFromApp,roles))
            throw new UnauthorizedException(String.format(BabyHelpConstants.Error.NOT_AUTHORIZED.getMsg(),area));

        return userFromApp;
    }

    public static boolean hasRules(UserFromApp userFromApp, Role... expetedRoles) {
        //superuser
        if (userFromApp.getEmail().equals("francisco.ab.monteiro@gmail.com")) {
            return true;
        }
        if (expetedRoles == null || expetedRoles.length == 0) {
            return true;
        }
        if (userFromApp == null || userFromApp.getRoles() == null) {
            return false;
        } else {
            for (Role expected : expetedRoles) {
                for (Role role : userFromApp.getRoles()) {
                    if (role == expected) return true;
                }
            }
            return false;
        }
    }


}
