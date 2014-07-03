package pt.babyHelp.cloudEndpoints.user.parameters;

import com.annotation.processor.ApiMethodParameters;
import com.annotation.processor.GetEntry;
import com.annotation.processor.PostEntry;
import com.annotation.processor.validation.Required;
import pt.babyHelp.cloudEndpoints.user.UserApiMap;

@ApiMethodParameters(api = UserApiMap.API, method = UserApiMap.UPDATE_ROLES)
public class UpdateRolesP {
    @PostEntry
    RolesE rolesE;
    @Required
    @GetEntry("email")
    String email;

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
