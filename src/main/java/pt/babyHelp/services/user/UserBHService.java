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
import pt.babyHelp.cloudEndpoints.user.UpdateProfessionP;
import pt.babyHelp.cloudEndpoints.user.UserApiMap;
import pt.babyHelp.cloudEndpoints.user.parameters.GetRolesP;
import pt.babyHelp.cloudEndpoints.user.parameters.RolesE;
import pt.babyHelp.cloudEndpoints.user.parameters.UpdateRolesP;
import pt.babyHelp.cloudEndpoints.user.parameters.UpdateUserNameP;
import pt.babyHelp.services.BHChecker;
import pt.babyHelp.services.BabyHelp;
import pt.core.cloudEndpoints.Authorization;
import pt.core.cloudEndpoints.CEUtils;
import pt.core.cloudEndpoints.services.CEService;
import pt.gapiap.cloud.endpoints.CEError;
import pt.gapiap.cloud.endpoints.CEErrorReturn;

import java.util.*;

public class UserBHService implements CEService {
    private BHAuthorization authorization;
    private Object entry;
    private UserApiMap apiMap;
    private BHChecker bhChecker;

    public static CEService create() {
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

    private Map<String, Object> updateRoles() throws CEError {
        UpdateRolesP updateRolesP = bhChecker.check(entry);
        String email = updateRolesP.getEmail();
        RolesE rolesEntry = updateRolesP.getRolesE();

        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            userFromApp = new UserFromApp();
            userFromApp.setEmail(email);
        }

        try {
            userFromApp.setRoles(rolesEntry.toEnum());
            if (BD.ofy().save().entity(userFromApp).now() == null)
                throw new CEError(BabyHelp.CEError.PERSIST, UserFromApp.class.getSimpleName());
            return CEUtils.createMapAndPut("state", "user atualizado");
        } catch (Role.ConvertException e) {
            throw new CEError(CEErrorR.ROLE_NOT_MATCH.addArgs(e.getRoleStr()));
        }
    }

    private Map<String, Object> list() throws CEError {
        return getList();
    }

    private Map<String, Object> getRoles() throws CEError {
        GetRolesP getRolesP = bhChecker.check(entry);
        String email = getRolesP.getEmail();

        if (email == null || email.isEmpty()) {
            throw new CEError(CEErrorR.EMAIL_REQUIRED);
        }

        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            return CEUtils.createMapAndPut("body",new ArrayList<String>(0));
        } else {
            return CEUtils.createMapAndPut("body", Role.toStringSet(userFromApp.getRoles()));
        }
    }

    private Map<String, Object> pendingActions() {
        UserFromApp userFromApp = authorization.getUserWithRoles();
        if (authorization.getUserWithRoles().getName() == null)
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

    private Map<String, Object> updateProfession() throws CEError {
        UpdateProfessionP updateProfessionP = bhChecker.check(entry);
        bhChecker.check(updateProfessionP);
        authorization.getUserWithRoles().setProfession(updateProfessionP.getProfession());
        authorization.savedUserFromApp();

        Map<String, Object> map = new HashMap<>();
        map.put("message", "A sua profissão como técnico de saude foi atualizada");
        map.put("current", authorization.getUserWithRoles().getProfession());
        return map;
    }

    private Map<String, Object> updateUserName() throws CEError {
        UpdateUserNameP updateUserNameP = bhChecker.check(entry);
        authorization.savedUserFromApp();
        return CEUtils.createMapAndPut("message", "Utilizador atualizado com sucesso");
    }


    @Override
    public CEService execute(User user, String method, Object entry) throws UnauthorizedException {
        this.authorization = new BHAuthorization(user);
        this.authorization.check(method);
        this.entry = entry;
        this.apiMap = new UserApiMap(method);
        this.bhChecker = new BHChecker();
        return this;
    }

    @Override
    public CEService execute(User user, String method) throws UnauthorizedException {
        return execute(user, method, null);
    }

    private Map<String, Object> currentUser() {
        return CEUtils.createMapAndPut("result", authorization.getUserFromApp().getEmail());
    }


    @Override
    public Object getCEResponse() throws CEError {
        switch (apiMap.getMethod()) {
            case UserApiMap.LIST:
                return getList();
            case UserApiMap.PENDING_ACTIONS:
                return pendingActions();
            case UserApiMap.UPDATE_PROFESSION:
                return updateProfession();
            case UserApiMap.UPDATE_ROLES:
                return updateRoles();
            case UserApiMap.GET_ROLES:
                return getRoles();
            case UserApiMap.UPDATE_USERNAME:
                return updateUserName();
            case UserApiMap.CURRENT:
                return currentUser();

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
