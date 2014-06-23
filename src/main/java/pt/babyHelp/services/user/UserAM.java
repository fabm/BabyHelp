package pt.babyHelp.services.user;

import pt.babyHelp.bd.embededs.Role;
import pt.core.cloudEndpoints.services.CEActionMap;

public enum UserAM implements CEActionMap<Role, UserAM> {
    LIST("lista de utilizadores"),
    UPDATE_ROLES("atualização de roles",Role.ADMINISTRATOR),
    GET_ROLES("visualização de roles",Role.ADMINISTRATOR),
    PENDING_ACTIONS("actions pendentes"),
    UPDATE_PROFESSION(true),
    UPDATE_USERNAME(true)
    ;

    private Role[] roles;
    private boolean ar;
    private String area;

    UserAM(String area,Role...roles) {
        this.roles = roles;
        this.ar = true;
        this.area = area;
    }

    UserAM(String area) {
        this.ar = true;
        this.area = area;
    }

    UserAM(){
        this.ar = false;
    }

    @Override
    public Role[] getRoles() {
        return this.roles;
    }

    @Override
    public UserAM getAction() {
        return this;
    }

    @Override
    public boolean autenticationRequired() {
        return this.ar;
    }
}
