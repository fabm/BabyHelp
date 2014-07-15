package pt.babyHelp.cloudEndpoints.user.parameters;

import pt.babyHelp.bd.embededs.Role;
import pt.gapiap.proccess.validation.annotations.Required;

public class RolesE {

    @Required
    private String[] roles;

    public String[] getRoles() {
        return roles;
    }

    public void setRoles(String[] roles) {
        this.roles = roles;
    }

    public Role[] toEnum(){
        Role[] eRoles = new Role[roles.length];
        for (int i = 0; i < roles.length; i++) {
            eRoles[i] = Role.convert(roles[i]);
        }
        return eRoles;
    }

}
