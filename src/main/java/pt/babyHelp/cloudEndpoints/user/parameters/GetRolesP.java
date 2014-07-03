package pt.babyHelp.cloudEndpoints.user.parameters;

import com.annotation.processor.ApiMethodParameters;
import com.annotation.processor.validation.Email;
import pt.babyHelp.cloudEndpoints.user.UserApiMap;

@ApiMethodParameters(api = UserApiMap.API ,method = UserApiMap.GET_ROLES)
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
