package pt.babyHelp.services;

import pt.babyHelp.bd.embededs.Role;
import pt.gapiap.cloud.endpoints.authorization.RolesCapturer;

public class RolesCapturerBH implements RolesCapturer<Role,RolesValidation>{
  @Override
  public Class<RolesValidation> getAnnotationClass() {
    return RolesValidation.class;
  }

  @Override
  public Role[] getRoles(RolesValidation annotation) {
    return annotation.value();
  }
}
