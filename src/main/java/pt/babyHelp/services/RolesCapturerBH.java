package pt.babyHelp.services;

import pt.babyHelp.bd.embededs.Role;
import pt.gapiap.runtime.reflection.EnumArrayFromAnnotation;

public class RolesCapturerBH implements EnumArrayFromAnnotation<Role, RolesValidation> {
  @Override
  public Class<RolesValidation> getAnnotationClass() {
    return RolesValidation.class;
  }

  @Override
  public Role[] getEnumArray(RolesValidation annotation) {
    return annotation.value();
  }
}
