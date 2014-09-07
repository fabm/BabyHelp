package pt.babyHelp.cloudEndpoints.user.parameters;


import pt.babyHelp.cloudEndpoints.user.UserApiMap;
import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.defaultValidator.DefaultValidator;

import javax.validation.constraints.NotNull;

@ApiMethodParameters(
        api = UserApiMap.API,
        method = UserApiMap.UPDATE_USERNAME,
        validators = DefaultValidator.class
)
public class UpdateUserNameP {
    @NotNull
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
