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
    public Object getRoles(GetRolesP getRolesP) throws CEError {
        String email = getRolesP.getEmail();


        UserFromApp userFromApp = UserFromApp.findByEmail(email);
        if (userFromApp == null) {
            return ImmutableMap.of("body", new ArrayList<String>(0));
        } else {
            return ImmutableMap.of("body", Role.toStringSet(userFromApp.getRoles()));
        }
    }

    private Map<String, Object> setSons(Son[] sons) {
        BD.ofy().save().entities(sons).now();

        return null;
    }

}
