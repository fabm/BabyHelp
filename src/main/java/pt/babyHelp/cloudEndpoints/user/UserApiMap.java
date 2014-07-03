package pt.babyHelp.cloudEndpoints.user;

import pt.babyHelp.bd.embededs.Role;
import pt.core.cloudEndpoints.services.CEApiMap;

public class UserApiMap implements CEApiMap<Role> {
    public static final String API = "userBH";

    public static final String LIST = "list";
    public static final String UPDATE_ROLES = "update.roles";
    public static final String GET_ROLES = "get.roles";
    public static final String PENDING_ACTIONS = "pending.actions";
    public static final String UPDATE_PROFESSION = "update.profession";
    public static final String UPDATE_USERNAME = "update.username";
    public static final String UPDATE_SONS = "update.sons";
    public static final String CURRENT = "current";

    private Role[] roles;
    private boolean autenticationRequired;
    private String area;
    private String method;


    public UserApiMap(String method) {
        init(method);
    }

    private void init(String method) {
        this.method = method;
        defArea();
        defRoles();
    }

    private void defRoles() {
        switch (method) {
            case LIST:
            case UPDATE_ROLES:
            case GET_ROLES:
                setRoles(Role.ADMINISTRATOR);
                return;
            case UPDATE_SONS:
                setRoles(Role.PARENT);
            case UPDATE_PROFESSION:
                setRoles(Role.HEALTHTEC);
        }
    }

    private void defArea() {
        switch (method) {
            case UserApiMap.LIST:
                this.area = "lista de utilizadores";
                return;
            case UserApiMap.UPDATE_ROLES:
                this.area = "atualização de roles";
                return;
            case UserApiMap.GET_ROLES:
                this.area = "visialização de roles";
                setRoles(Role.ADMINISTRATOR);
                return;
            case UserApiMap.PENDING_ACTIONS:
                this.area = "ações pendentes";
                return;
            case UserApiMap.UPDATE_PROFESSION:
                this.area = "atualização da profissão";
                return;
            case UserApiMap.UPDATE_USERNAME:
                this.area = "atualização do username";
                return;
            case UserApiMap.UPDATE_SONS:
                this.area = "atualização de filhos";
                return;
        }
    }


    private void setRoles(Role... roles) {
        this.roles = roles;
    }

    @Override
    public Role[] getRoles() {
        return this.roles;
    }

    @Override
    public String getMethod() {
        return this.method;
    }

    @Override
    public boolean autenticationRequired() {
        return this.autenticationRequired;
    }

    @Override
    public String getArea() {
        return this.area;
    }

}
