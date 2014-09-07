package pt.babyHelp.services.user;

import com.google.common.collect.ImmutableMap;
import com.google.inject.Inject;
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
import pt.babyHelp.services.RolesValidation;
import pt.gapiap.cloud.endpoints.errors.CEError;
import pt.gapiap.proccess.annotations.MappedAction;

import java.util.*;

public class UserBHServiceImp implements UserBHService {

    @Inject
    private BHAuthorization bhAuthorization;

    @Override
    @MappedAction(value = UserApiMap.LIST, area = "lista de utilizadores")
    @RolesValidation(Role.ADMINISTRATOR)
    public Map<String, Object> getList() throws CEError {
        Iterator<UserFromApp> it = UserFromApp.iterateAll();
        Map<String, Object> map = new HashMap<String, Object>();
        List<Object> users = new ArrayList<Object>();

        while (it.hasNext()) {
            List<Object> user = new ArrayList<Object>();
            List<String> roles = new ArrayList<String>();
            UserFromApp userFromApp = it.next();
            user.add(userFromApp.getEmail());

            Set<Role> userRoles = userFromApp.getRoles();
            if (userRoles != null) {
                for (Role role : userRoles) {
                    roles.add(role.toString());
                }
            }
            user.add(roles);
            users.add(user);
        }
        map.put("body", users);
        return map;
    }

    @Override
    @MappedAction(value = UserApiMap.UPDATE_ROLES, area = "atualização de roles")
    @RolesValidation(Role.ADMINISTRATOR)
    public Object updateRoles(UpdateRolesP updateRolesP) throws CEError {
        String email = updateRolesP.getEmail();
        RolesE rolesEntry = updateRolesP.getRolesE();

        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            userFromApp = new UserFromApp();
            userFromApp.setEmail(email);
        }

        userFromApp.setRoles(rolesEntry.toEnum());
        BD.ofy().save().entity(userFromApp).now();
        return ImmutableMap.of("state", "user atualizado");
    }

    @Override
    @MappedAction(value = UserApiMap.GET_ROLES, area = "visialização de roles")
    @RolesValidation(Role.ADMINISTRATOR)
    public Object getRoles(GetRolesP getRolesP) throws CEError {
        String email = getRolesP.getEmail();


        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            return ImmutableMap.of("body", new ArrayList<String>(0));
        } else {
            return ImmutableMap.of("body", Role.toStringSet(userFromApp.getRoles()));
        }
    }

    @Override
    @MappedAction(value = UserApiMap.PENDING_ACTIONS, area = "ações pendentes")
    @RolesValidation(Role.ADMINISTRATOR)
    public Object pendingActions(UserFromApp userFromApp) {
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
            return ImmutableMap.of("pending", pendingParentalityList);
        }
        return ImmutableMap.of("pending", "nothing");
    }

    private Map<String, Object> setSons(Son[] sons) {
        BD.ofy().save().entities(sons).now();

        return null;
    }

    @Override
    @MappedAction(value = UserApiMap.UPDATE_PROFESSION, area = "atualização da profissão")
    @RolesValidation(Role.ADMINISTRATOR)
    public Map<String, Object> updateProfession(UpdateProfessionP updateProfessionP) throws CEError {
        bhAuthorization.getUserWithRoles().setProfession(updateProfessionP.getProfession());
        bhAuthorization.savedUser();

        Map<String, Object> map = new HashMap<>();
        map.put("message", "A sua profissão como técnico de saude foi atualizada");
        map.put("current", bhAuthorization.getUserWithRoles().getProfession());
        return map;
    }

    @Override
    @MappedAction(value = UserApiMap.UPDATE_USERNAME, area = "atualização do username")
    @RolesValidation(Role.ADMINISTRATOR)
    public Object updateUserName(UpdateUserNameP updateUserNameP) throws CEError {
        bhAuthorization.savedUser();
        return ImmutableMap.of("message", "Utilizador atualizado com sucesso");
    }

}
