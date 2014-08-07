package pt.babyHelp.cloudEndpoints.user.parameters;


import pt.babyHelp.cloudEndpoints.user.UserApiMap;
import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.DefaultValidator;
import pt.gapiap.proccess.validation.annotations.Required;
import pt.gapiap.proccess.validation.annotations.Size;

@ApiMethodParameters(
        api = UserApiMap.API,
        method = UserApiMap.UPDATE_USERNAME,
        validator = DefaultValidator.class
)
public class UpdateUserNameP {
    @Required
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
