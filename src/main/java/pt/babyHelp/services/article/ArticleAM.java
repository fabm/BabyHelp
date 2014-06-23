package pt.babyHelp.services.article;

import pt.babyHelp.bd.embededs.Role;
import pt.core.cloudEndpoints.services.CEActionMap;

public enum ArticleAM implements CEActionMap<Role, ArticleAM> {
    CREATE("criação de um artigo",Role.HEALTHTEC),
    UPDATE("atualização de um artigo",Role.HEALTHTEC),
    LIST_MY("lista dos artigos do autor",Role.HEALTHTEC),
    LIST_PUBLIC("lista dos artigos públicos",Role.HEALTHTEC),
    DELETE("remoção de artigos",Role.HEALTHTEC),
    GET("artigo",Role.HEALTHTEC);

    private Role[] roles;
    private boolean ar;
    private String area;

    ArticleAM(String area, Role... roles) {
        this.roles = roles;
        this.ar = true;
        this.area = area;
    }

    ArticleAM(String area) {
        this.ar = true;
        this.area = area;
    }

    ArticleAM(boolean ar) {
        this.ar = ar;
    }

    @Override
    public Role[] getRoles() {
        return this.roles;
    }

    @Override
    public ArticleAM getAction() {
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
