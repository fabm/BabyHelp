package pt.babyHelp.cloudEndpoints.user;

import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.DefaultValidator;
import pt.gapiap.proccess.validation.annotations.Required;

@ApiMethodParameters(
        api = UserApiMap.API,
        method = UserApiMap.UPDATE_PROFESSION,
        validator = DefaultValidator.class
)
public class UpdateProfessionP {
    @Required
    String profession;

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }
}
