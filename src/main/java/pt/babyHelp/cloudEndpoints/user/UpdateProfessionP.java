package pt.babyHelp.cloudEndpoints.user;


import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.defaultValidator.DefaultValidator;

import javax.validation.constraints.NotNull;

@ApiMethodParameters(
        api = UserApiMap.API,
        method = UserApiMap.UPDATE_PROFESSION,
        validators = DefaultValidator.class
)
public class UpdateProfessionP {
    @NotNull
    String profession;

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }
}
