package pt.babyHelp.services.article;

import pt.babyHelp.bd.embededs.Role;
import pt.core.cloudEndpoints.services.CEApiMap;

public class ArticleApiMap implements CEApiMap<Role> {

    public static final String API = "article";

    public static final String CREATE = "create";
    public static final String UPDATE = "update";
    public static final String LIST_MY = "list.my";
    public static final String LIST_PUBLIC = "list.public";
    public static final String DELETE = "delete";
    public static final String GET = "get";


    private Role[] roles;
    private boolean authenticatedRequired;
    private String area;
    private String method;

    ArticleApiMap(String method) {
        this.method = method;
    }


    private Role[] switchRoles() {
        switch (method) {
            case CREATE:
            case UPDATE:
            case LIST_MY:
            case DELETE:
            case GET:
                return new Role[]{Role.HEALTHTEC};
            case LIST_PUBLIC:
                return new Role[]{};
        }
        return null;
    }

    private String switchArea() {
        switch (method) {
            case CREATE:
                return "criação de um artigo";
            case UPDATE:
                return "atualização de um artigo";
            case LIST_MY:
                return "lista dos artigos do autor";
            case LIST_PUBLIC:
                return "lista dos artigos públicos";
            case DELETE:
                return "remoção de artigos";
            case GET:
                return "detalhe do artigo";
        }
        return null;
    }

    private boolean switchAuthenticatedRequired() {
        switch (method) {
            case LIST_PUBLIC:
                return false;
        }
        return true;
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
        return this.authenticatedRequired;
    }

    @Override
    public String getArea() {
        return this.area;
    }
}
