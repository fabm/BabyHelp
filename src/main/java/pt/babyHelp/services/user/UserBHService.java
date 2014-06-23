package pt.babyHelp.services.user;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.PendingParentality;
import pt.babyHelp.bd.Son;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.cloudEndpoints.user.RolesParameters;
import pt.babyHelp.services.BabyHelp;
import pt.core.cloudEndpoints.*;
import pt.core.cloudEndpoints.services.CEService;
import pt.core.validators.EmailChecker;

import java.util.*;

public class UserBHService implements CEService<UserAM> {
    private Authorization authorization;
    private Object[] args;
    private UserAM action;

    public static CEService<UserAM> create() {
        return new UserBHService();
    }

    private static Map<String, Object> getList() throws CEError {
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

    private Map<String, Object> updateRoles(String email, RolesParameters rolesParameters) throws CEError {

        Map<String, Object> map = new HashMap<String, Object>();
        if (email == null) {
            throw new CEError(CEErrorR.EMAIL_REQUIRED);
        }

        if (!EmailChecker.check(email)) {
            throw new CEError(CEErrorR.EMAIL_MALFORMED);
        }

        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            userFromApp = new UserFromApp();
            userFromApp.setEmail(email);
        }

        try {
            userFromApp.setRoles(rolesParameters.toEnum());
            if (BD.ofy().save().entity(userFromApp).now() == null)
                throw new CEError(BabyHelp.CEError.PERSIST, UserFromApp.class.getSimpleName());
            map.put("state", "user atualizado");
        } catch (Role.ConvertException e) {
            throw new CEError(CEErrorR.ROLE_NOT_MATCH.addArgs(e.getRoleStr()));
        }
        return map;
    }

    private Map<String, Object> list() throws CEError {
        return getList();
    }

    private Map<String, Object> getRoles(String email) throws CEError {
        Map<String, Object> map = new HashMap<String, Object>();

        if (email == null || email.isEmpty()) {
            throw new CEError(CEErrorR.EMAIL_REQUIRED);
        }

        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            map.put("body", new HashSet<String>());
        } else {
            map.put("body", Role.toStringSet(userFromApp.getRoles()));
        }
        return map;
    }

    private Map<String, Object> pendingActions() {
        UserFromApp userFromApp = authorization.getUserFromApp();
        if (authorization.getUserFromApp().getName() == null)
            return CEUtils.createMapAndPut("pending", "userName");

        if (authorization.hasRole(Role.HEALTHTEC) && userFromApp.getProfession() == null) {
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

    private Map<String, Object> setSons(Son[] sons) {
        BD.ofy().save().entities(sons).now();

        return null;
    }

    private Map<String, Object> updateHealthTec(Map<String, Object> entryMap) throws CEError {
        MapFieldValidator mapFV = new MapFieldValidator(entryMap);
        mapFV.setErrorReturnRequired(BabyHelp.CEError.REQUIRED_FIELD);
        authorization.getUserFromApp().setProfession(mapFV.<String>require("profession", "profissão"));
        authorization.savedUserFromApp();

        Map<String, Object> map = CEUtils.createMapAndPut("message", "A sua profissão como técnico de saude foi atualizada");
        map.put("current", authorization.getUserFromApp().getProfession());
        return map;
    }

    private Map<String, Object> updateUserName(Map<String, Object> entryMap) throws CEError {
        MapFieldValidator mapFV = new MapFieldValidator(entryMap);
        authorization.getUserFromApp().setName(mapFV.<String>get("name"));
        authorization.savedUserFromApp();
        return CEUtils.createMapAndPut("message", "Utilizador atualizado com sucesso");
    }


    @Override
    public UserBHService execute(User user, UserAM action, Object... args) throws UnauthorizedException {
        this.authorization = new BHAuthorization(user);
        this.authorization.check(action);
        this.args = args;
        this.action = action;
        return this;
    }


    @Override
    public Object getCEResponse() throws CEError {
        switch (action) {
            case LIST:
                return getList();
            case PENDING_ACTIONS:
                return pendingActions();
            case UPDATE_PROFESSION:
                return updateHealthTec((Map<String, Object>) args[0]);
            case UPDATE_ROLES:
                return updateRoles((String) args[0], (RolesParameters) args[1]);
            case GET_ROLES:
                return getRoles((String) args[0]);
            case UPDATE_USERNAME:
                return updateUserName((Map<String, Object>) args[0]);
        }
        throw new UnsupportedOperationException(CEErrorReturn.NOT_IMPLEMENTED);
    }

    enum CEErrorR implements CEErrorReturn {
        ROLE_NOT_MATCH(0, "Não é possível corresponder o role %s a nenhum role existente"),
        EMAIL_REQUIRED(1, "O campo email é obrigatório"),
        EMAIL_MALFORMED(2, "O campo email está mal formatado");

        private String msg;
        private int code;

        CEErrorR(int code, String msg) {
            this.msg = msg;
            this.code = code;
        }

        @Override
        public int getCode() {
            return this.code;
        }

        @Override
        public String getMsg() {
            return this.msg;
        }

        public CEErrorR addArgs(String... vars) {
            this.msg = String.format(msg, vars);
            return this;
        }

        @Override
        public String getContext() {
            return "userBH";
        }
    }
}
