package pt.babyHelp.endPoints.userEndPoint;

import pt.babyHelp.bd.embededs.Role;

public class RolesParameters {
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
