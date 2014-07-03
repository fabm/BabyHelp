package pt.babyHelp.cloudEndpoints.user.parameters;

import com.annotation.processor.validation.Required;

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
