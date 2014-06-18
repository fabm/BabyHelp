package pt.babyHelp.services.impl;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.*;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.services.BabyHelp;
import pt.core.cloudEndpoints.CEUtils;
import pt.core.cloudEndpoints.MapFieldValidator;
import pt.core.validators.EmailChecker;
import pt.core.cloudEndpoints.Authorization;
import pt.babyHelp.cloudEndpoints.user.RolesParameters;
import pt.babyHelp.services.UserBHService;

import java.util.*;

public class UserBHServiceImpl implements UserBHService {
    private Authorization authorization;

    private static Map<String, Object> getList() throws pt.core.cloudEndpoints.CEError {
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
    public Map<String, Object> updateRoles(String email, RolesParameters rolesParameters) throws pt.core.cloudEndpoints.CEError, UnauthorizedException {
        getAuthorization().check("atualização de utilizadores", Role.ADMINISTRATOR);

        Map<String, Object> map = new HashMap<String, Object>();
        if (email == null) {
            throw new pt.core.cloudEndpoints.CEError(CEError.EMAIL_REQUIRED);
        }

        if (!EmailChecker.check(email)) {
            throw new pt.core.cloudEndpoints.CEError(CEError.EMAIL_MALFORMED);
        }

        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            userFromApp = new UserFromApp();
            userFromApp.setEmail(email);
        }

        try {
            userFromApp.setRoles(rolesParameters.toEnum());
            if (BD.ofy().save().entity(userFromApp).now() == null)
                throw new pt.core.cloudEndpoints.CEError(BabyHelp.CEError.PERSIST, UserFromApp.class.getSimpleName());
            map.put("state", "user atualizado");
        } catch (Role.ConvertException e) {
            throw new pt.core.cloudEndpoints.CEError(CEError.ROLE_NOT_MATCH.addArgs(e.getRoleStr()));
        }
        return map;
    }

    @Override
    public Map<String, Object> list() throws pt.core.cloudEndpoints.CEError {
        return getList();
    }


    @Override
    public Map<String, Object> getRoles(String email) throws pt.core.cloudEndpoints.CEError, UnauthorizedException {
        getAuthorization().check("verificação de roles", Role.ADMINISTRATOR);
        Map<String, Object> map = new HashMap<String, Object>();

        if (email == null || email.isEmpty()) {
            throw new pt.core.cloudEndpoints.CEError(CEError.EMAIL_REQUIRED);
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
    public Map<String, Object> pendingActions() {
        UserFromApp userFromApp = getAuthorization().getUserFromApp();
        if(getAuthorization().getUserFromApp().getName()==null)
            return CEUtils.createMapAndPut("pending","userName");

        if (getAuthorization().hasRole(Role.HEALTHTEC) && userFromApp.getProfession() == null) {
            return CEUtils.createMapAndPut("pending", "profession");
        }
        Map<String, Object> map;

        Query<PendingParentality> query = BD.ofy().load().type(PendingParentality.class)
                .filter("parent", userFromApp.getEmail());

        if (query.count() > 0) {
            List<String> emails = new ArrayList<String>();
            List<Long> sonsList = new ArrayList<Long>();
            List<PendingParentality> pendingsList = new ArrayList<PendingParentality>();

            for (PendingParentality pp : query) {
                emails.add(pp.getParent());
                emails.add(pp.getAskedFor());
                pendingsList.add(pp);
                sonsList.add(pp.getSonId());
            }
            Map<String, UserFromApp> usersMap = BD.ofy().load().type(UserFromApp.class).ids(emails);
            Map<Long, Son> sonsMap = BD.ofy().load().type(Son.class).ids(sonsList);
            List<Map<String, Object>> pendingParentalityList = new ArrayList<Map<String, Object>>();
            for (PendingParentality pp : pendingsList) {
                UserFromApp userWhoAsk = usersMap.get(pp.getAskedFor());
                UserFromApp userWhoConfirms = usersMap.get(pp.getParent());
                Son son = sonsMap.get(pp.getParent());
                Map<String, Object> pendingParentalityMap = new HashMap<String, Object>();

                HashMap<String, Object> mapper = new HashMap<String, Object>();
                mapper.put("name", userWhoAsk.getName());
                mapper.put("email", userWhoAsk.getEmail());
                pendingParentalityMap.put("asker", mapper);

                mapper = new HashMap<String, Object>();
                mapper.put("name", userWhoConfirms.getName());
                mapper.put("email", userWhoConfirms.getEmail());
                pendingParentalityMap.put("confirmer", mapper);

                mapper = new HashMap<String, Object>();
                mapper.put("name", son.getName());
                mapper.put("photoKey", son.getPhotoKey());
                mapper.put("birthDay", son.getBirthDate());
                pendingParentalityMap.put("son", mapper);

                pendingParentalityList.add(pendingParentalityMap);
            }
            map = CEUtils.createMapAndPut("pending", "sons");
            map.put("sons", pendingParentalityList);
            return CEUtils.createMapAndPut("pending", pendingParentalityList);
        }
        return CEUtils.createMapAndPut("pending", "nothing");
    }


    @Override
    public Map<String, Object> setSons(Son[] sons) {
        BD.ofy().save().entities(sons).now();

        return null;
    }

    @Override
    public Map<String, Object> updateHealthTec(Map<String, Object> entryMap) throws pt.core.cloudEndpoints.CEError {
        MapFieldValidator mapFV = new MapFieldValidator(entryMap);
        mapFV.setErrorReturnRequired(BabyHelp.CEError.REQUIRED_FIELD);
        getAuthorization().getUserFromApp().setProfession(mapFV.<String>require("profession", "profissão"));
        getAuthorization().savedUserFromApp();

        Map<String, Object> map = CEUtils.createMapAndPut("message", "A sua profissão como técnico de saude foi atualizada");
        map.put("current",getAuthorization().getUserFromApp().getProfession());
        return map;
    }

    @Override
    public Map<String, Object> updateUserName(Map<String, Object> entryMap) throws pt.core.cloudEndpoints.CEError {
        MapFieldValidator mapFV = new MapFieldValidator(entryMap);
        getAuthorization().getUserFromApp().setName(mapFV.<String>get("name"));
        getAuthorization().savedUserFromApp();
        return CEUtils.createMapAndPut("message","Utilizador atualizado com sucesso");
    }

    @Override
    public void setUser(User user) {
        authorization = new BHAuthorization(user);
    }

    @Override
    public Authorization getAuthorization() {
        return authorization;
    }

}
