package pt.babyHelp.cloudEndpoints.user.parameters;

import pt.babyHelp.cloudEndpoints.user.UserApiMap;
import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.annotations.Embedded;
import pt.gapiap.proccess.validation.DefaultValidator;
import pt.gapiap.proccess.validation.annotations.Required;

@ApiMethodParameters(
        api = UserApiMap.API,
        method = UserApiMap.UPDATE_ROLES,
        validator = DefaultValidator.class
)
public class UpdateRolesP {

    @Embedded
    private RolesE rolesE;
    @Required
    private String email;

    public RolesE getRolesE() {
        return rolesE;
    }

    public void setRolesE(RolesE rolesE) {
        this.rolesE = rolesE;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

}
