package pt.babyHelp.services.impl;

import com.google.appengine.api.users.User;
import pt.babyHelp.bd.PersistenceException;
import pt.babyHelp.bd.Role;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.session.UserContext;
import pt.babyHelp.endPoints.userEndPoint.RolesParameters;
import pt.babyHelp.services.UserBHService;

import java.util.*;

public class UserBHServiceImpl implements UserBHService {
    private UserFromApp user;

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
    public Map<String, Object> currentEmail() {
        Map<String, Object> map = new HashMap<String, Object>();
        if (user == null) {
            map.put("user", "guest");
            return map;
        }
        map.put("user", user.getEmail());
        return map;
    }

    @Override
    public Map<String, Object> checkRoles(RolesParameters rolesParameters) throws EndPointError {
        Map<String, Object> map = new HashMap<String, Object>();
        Map<String, Boolean> rolesMap = new HashMap<String, Boolean>();
        if (user == null) {
            for (String role : rolesParameters.getRoles()) {
                rolesMap.put(role, false);
            }
        } else {
            UserContext userContext = UserContext.createUserContext(user);
            try {
                for (Role role : rolesParameters.toEnum()) {
                    rolesMap.put(role.name(), userContext.hasRules(role));
                }
            } catch (Role.ConvertException e) {
                throw new EndPointError(UserBHService.Error.ROLE_NOT_MATCH.addArgs(e.getRoleStr()));
            }
        }
        map.put("roles", rolesMap);
        return map;
    }

    @Override
    public Map<String, Object> updateRoles(String email, RolesParameters rolesParameters) throws EndPointError {
        Map<String, Object> map = new HashMap<String, Object>();
        if (email == null) {
            throw new EndPointError(Error.EMAIL_REQUIRED);
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
        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            map.put("body", new HashSet<String>());
        } else {
            map.put("body", Role.toStringSet(userFromApp.getRoles()));
        }
        return map;
    }

    @Override
    public void setUser(User user) throws EndPointError {
        this.user = new UserFromApp();
        this.user.setEmail(user.getEmail());
    }

    private static enum UpdateRoleAction {
        add, delete
    }
}
