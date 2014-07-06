package pt.babyHelp.cloudEndpoints.user.parameters;

import pt.babyHelp.cloudEndpoints.user.UserApiMap;
import pt.json.proccess.annotations.ApiMethodParameters;
import pt.json.proccess.validation.DefaultValidator;
import pt.json.proccess.validation.annotations.Email;

@ApiMethodParameters(
        api = UserApiMap.API,
        method = UserApiMap.GET_ROLES,
        validator = DefaultValidator.class
)
public class GetRolesP {
    @Email
    private String email;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
