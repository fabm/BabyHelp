package pt.babyHelp.services.impl;

import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.PersistenceException;
import pt.babyHelp.bd.Role;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.session.UserContext;
import pt.babyHelp.core.validators.EmailChecker;
import pt.babyHelp.endPoints.userEndPoint.RolesParameters;
import pt.babyHelp.services.UserBHService;

import java.util.*;

public class UserBHServiceImpl implements UserBHService {
    private UserContext userContext;

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
    public Map<String, Object> createSession() throws EndPointError {
        Map<String, Object> map = new HashMap<String, Object>();
        if (userContext == null) {
            map.put("user", "guest");
        } else {
            UserFromApp userFromApp = userContext.getUserFromApp();
            BD.ofy().save().entity(userFromApp).now();
            map.put("user", userFromApp.getEmail());
        }
        return map;
    }

    @Override
    public Map<String, Object> updateRoles(String email, RolesParameters rolesParameters) throws EndPointError {
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
            userFromApp.save();
        } catch (PersistenceException e) {
            throw new EndPointError(Error.PERSISTENCE.addArgs("UserFromApp"));
        } catch (Role.ConvertException e) {
            throw new EndPointError(Error.ROLE_NOT_MATCH.addArgs(e.getRoleStr()));
        }
        map.put("state", "user atualizado");
        return map;
    }

    @Override
    public Map<String, Object> list() throws EndPointError {
        return getList();
    }


    @Override
    public Map<String, Object> getRoles(String email) throws EndPointError {
        Map<String, Object> map = new HashMap<String, Object>();

        if(email == null || email.isEmpty()){
            throw  new EndPointError(Error.EMAIL_REQUIRED);
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
    public Map<String, Object> uploadToken(String token) {
        return null;
    }

    @Override
    public void setUserContext(UserContext userContext) throws EndPointError {
        this.userContext = userContext;
    }

    private static enum UpdateRoleAction {
        add, delete
    }
}
