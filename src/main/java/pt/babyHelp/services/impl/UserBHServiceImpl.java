package pt.babyHelp.services.impl;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.Key;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.Son;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.validators.EmailChecker;
import pt.babyHelp.endPoints.Authorization;
import pt.babyHelp.endPoints.userEndPoint.RolesParameters;
import pt.babyHelp.services.UserBHService;

import java.util.*;

public class UserBHServiceImpl implements UserBHService {
    private Authorization authorization;

    private static Map<String, Object> getList() throws EndPointError {
        Iterator<UserFromApp> it = UserFromApp.iterateAll();
        Map<String, Object> map = new HashMap<String, Object>();
        List<Object> users = new ArrayList<Object>();

        while (it.hasNext()) {
            List<Object> user = new ArrayList<Object>();
            List<String> roles = new ArrayList<String>();
            UserFromApp userFromApp = it.next();
            user.add(userFromApp.getEmail());

            Set<Role> userRoles = userFromApp.getRoles();
            if (userRoles != null)
                for (Role role : userRoles) {
                    roles.add(role.toString());
                }
            user.add(roles);
            users.add(user);
        }
        map.put("body", users);
        return map;
    }


    @Override
    public Map<String, Object> updateRoles(String email, RolesParameters rolesParameters) throws EndPointError, UnauthorizedException {
        getAuthorization().check("atualização de utilizadores", Role.ADMINISTRATOR);

        Map<String, Object> map = new HashMap<String, Object>();
        if (email == null) {
            throw new EndPointError(Error.EMAIL_REQUIRED);
        }

        if (!EmailChecker.check(email)) {
            throw new EndPointError(Error.EMAIL_MALFORMED);
        }

        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            userFromApp = new UserFromApp();
            userFromApp.setEmail(email);
        }

        try {
            userFromApp.setRoles(rolesParameters.toEnum());
            if (BD.ofy().save().entity(userFromApp).now() == null)
                throw new EndPointError(Error.PERSISTENCE.addArgs("UserFromApp"));
            map.put("state", "user atualizado");
        } catch (Role.ConvertException e) {
            throw new EndPointError(Error.ROLE_NOT_MATCH.addArgs(e.getRoleStr()));
        }
        return map;
    }

    @Override
    public Map<String, Object> list() throws EndPointError {
        return getList();
    }


    @Override
    public Map<String, Object> getRoles(String email) throws EndPointError, UnauthorizedException {
        getAuthorization().check("verificação de roles", Role.ADMINISTRATOR);
        Map<String, Object> map = new HashMap<String, Object>();

        if (email == null || email.isEmpty()) {
            throw new EndPointError(Error.EMAIL_REQUIRED);
        }

        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            map.put("body", new HashSet<String>());
        } else {
            map.put("body", Role.toStringSet(userFromApp.getRoles()));
        }
        return map;
    }


    @Override
    public Map<String, Object> actionsPending() {
        //TODO completar actions pending
        return null;
    }



    @Override
    public Map<String, Object> setSons(Son[] sons) {
        BD.ofy().save().entities(sons).now();

        return null;
    }

    @Override
    public void setUser(User user) {
        authorization = new Authorization(user);
    }

    @Override
    public Authorization getAuthorization() {
        return authorization;
    }

}
