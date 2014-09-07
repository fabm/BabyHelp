package pt.babyHelp.services.user;

import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.user.UpdateProfessionP;
import pt.babyHelp.cloudEndpoints.user.UserApiMap;
import pt.babyHelp.cloudEndpoints.user.parameters.GetRolesP;
import pt.babyHelp.cloudEndpoints.user.parameters.UpdateRolesP;
import pt.babyHelp.cloudEndpoints.user.parameters.UpdateUserNameP;
import pt.babyHelp.services.RolesValidation;
import pt.gapiap.cloud.endpoints.errors.CEError;
import pt.gapiap.proccess.annotations.MappedAction;

import java.util.Map;

public interface UserBHService {

    @RolesValidation(Role.ADMINISTRATOR)
    Map<String, Object> getList() throws CEError;

    @RolesValidation(Role.ADMINISTRATOR)
    Object updateRoles(UpdateRolesP updateRolesP) throws CEError;

    @RolesValidation(Role.ADMINISTRATOR)
    Object getRoles(GetRolesP getRolesP) throws CEError;

    Object pendingActions(UserFromApp userFromApp);

    @RolesValidation(Role.ADMINISTRATOR)
    Map<String, Object> updateProfession(UpdateProfessionP updateProfessionP) throws CEError;

    @RolesValidation(Role.ADMINISTRATOR)
    Object updateUserName(UpdateUserNameP updateUserNameP) throws CEError;

}
