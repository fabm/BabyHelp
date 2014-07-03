package pt.babyHelp.cloudEndpoints.user;

import com.annotation.processor.ApiMethodParameters;
import com.annotation.processor.validation.Required;

@ApiMethodParameters(api = UserApiMap.API,method = UserApiMap.UPDATE_PROFESSION)
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
