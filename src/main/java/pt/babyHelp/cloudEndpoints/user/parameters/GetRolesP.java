package pt.babyHelp.cloudEndpoints.user.parameters;

import pt.babyHelp.cloudEndpoints.user.UserApiMap;
import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.defaultValidator.DefaultValidator;
import pt.gapiap.proccess.validation.annotations.Email;

import javax.validation.constraints.NotNull;

@ApiMethodParameters(
        api = UserApiMap.API,
        method = UserApiMap.GET_ROLES,
        validators = DefaultValidator.class
)
public class GetRolesP {
    @Email
    @NotNull
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
