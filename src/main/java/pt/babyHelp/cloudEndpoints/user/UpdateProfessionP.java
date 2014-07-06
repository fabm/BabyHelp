package pt.babyHelp.cloudEndpoints.user;


import pt.json.proccess.annotations.ApiMethodParameters;
import pt.json.proccess.validation.DefaultValidator;
import pt.json.proccess.validation.annotations.Required;

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
