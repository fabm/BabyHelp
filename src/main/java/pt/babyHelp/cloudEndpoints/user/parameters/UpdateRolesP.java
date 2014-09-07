package pt.babyHelp.cloudEndpoints.user.parameters;

import pt.babyHelp.cloudEndpoints.user.UserApiMap;
import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.annotations.Embedded;
import pt.gapiap.proccess.validation.defaultValidator.DefaultValidator;
import javax.validation.constraints.NotNull;

@ApiMethodParameters(
        api = UserApiMap.API,
        method = UserApiMap.UPDATE_ROLES,
        validators = DefaultValidator.class
)
public class UpdateRolesP {

    @Embedded
    private RolesE rolesE;
    @NotNull
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
