package pt.babyHelp.cloudEndpoints.user.parameters;

import pt.gapiap.proccess.validation.annotations.Required;

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
