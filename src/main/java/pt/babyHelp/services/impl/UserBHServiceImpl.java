package pt.babyHelp.services.impl;

import org.apache.commons.lang3.RandomStringUtils;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.PersistenceException;
import pt.babyHelp.bd.Role;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.session.UserContext;
import pt.babyHelp.endPoints.userEndPoint.RolesParameters;
import pt.babyHelp.services.UserBHService;

import java.security.NoSuchAlgorithmException;
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

    private static String toHex(byte[] byteData) {
        //convert the byte to hex format method 1
        StringBuffer sb = new StringBuffer();
        for (int i = 0; i < byteData.length; i++) {
            sb.append(Integer.toString((byteData[i] & 0xff) + 0x100, 16).substring(1));
        }
        return sb.toString();
    }

    @Override
    public Map<String, Object> createToken() throws EndPointError {
        Map<String, Object> map = new HashMap<String, Object>();
        if (userContext == null) {
            map.put("user", "guest");
            return map;
        }
        UserFromApp userFromApp = userContext.getUserFromApp();
        String token = RandomStringUtils.randomAlphanumeric(20);
        token = userFromApp.getEmail()+":"+token;
        try {
            userFromApp.createHash(token);
        } catch (NoSuchAlgorithmException e) {
            throw new EndPointError(Error.MISS_ALGORITHM);
        }
        BD.ofy().save().entity(userFromApp).now();
        map.put("bhapitoken", token);
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
    public void setUserContext(UserContext userContext) throws EndPointError {
        this.userContext = userContext;
    }

    private static enum UpdateRoleAction {
        add, delete
    }
}
