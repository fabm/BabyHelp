package pt.babyHelp.services.user;

import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.user.parameters.GetRolesP;
import pt.babyHelp.cloudEndpoints.user.parameters.UpdateRolesP;
import pt.babyHelp.services.RolesValidation;
import pt.gapiap.cloud.endpoints.errors.CEError;

import java.util.Map;

public interface UserBHService {

  @RolesValidation(Role.ADMINISTRATOR)
  Map<String, Object> getList() throws CEError;

  @RolesValidation(Role.ADMINISTRATOR)
  Object updateRoles(UpdateRolesP updateRolesP) throws CEError;

  @RolesValidation(Role.ADMINISTRATOR)
  Object getRoles(GetRolesP getRolesP) throws CEError;

}
