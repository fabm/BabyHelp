package pt.babyHelp.cloudEndpoints.user.parameters;

import pt.babyHelp.cloudEndpoints.user.UserApiMap;
import pt.json.proccess.annotations.ApiMethodParameters;
import pt.json.proccess.annotations.Embedded;
import pt.json.proccess.validation.DefaultValidator;
import pt.json.proccess.validation.annotations.Required;

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
