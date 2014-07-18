package pt.babyHelp.cloudEndpoints.user.parameters;

import pt.babyHelp.cloudEndpoints.user.UserApiMap;
import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.DefaultValidator;
import pt.gapiap.proccess.validation.annotations.Email;
import pt.gapiap.proccess.validation.annotations.Required;

@ApiMethodParameters(
        api = UserApiMap.API,
        method = UserApiMap.GET_ROLES,
        validator = DefaultValidator.class
)
public class GetRolesP {
    @Email
    @Required
    private String email;

    public GetRolesP(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
