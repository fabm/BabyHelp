package pt.babyHelp.services.user;

import pt.babyHelp.bd.embededs.Role;
import pt.core.cloudEndpoints.services.CEActionMap;

public enum UserAM implements CEActionMap<Role, UserAM> {
    LIST("lista de utilizadores"),
    UPDATE_ROLES("atualização de roles",Role.ADMINISTRATOR),
    GET_ROLES("visualização de roles",Role.ADMINISTRATOR),
    PENDING_ACTIONS("ações pendentes"),
    UPDATE_PROFESSION("atualização da profissão"),
    UPDATE_USERNAME("atualização do username"),
    UPDATE_SONS("atualização de filhos", Role.PARENT),
    CURRENT(false);

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

    UserAM(boolean ar) {
        this.ar = ar;
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

    @Override
    public String getArea() {
        return this.area;
    }
}
