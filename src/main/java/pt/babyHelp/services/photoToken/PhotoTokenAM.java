package pt.babyHelp.services.photoToken;

import pt.babyHelp.bd.embededs.Role;
import pt.core.cloudEndpoints.services.CEActionMap;

public enum PhotoTokenAM implements CEActionMap<Role, PhotoTokenAM> {
    GET("obter um token do upload de uma imagem");

    private Role[] roles;
    private boolean ar;
    private String area;

    PhotoTokenAM(String area, Role... roles) {
        this.roles = roles;
        this.ar = true;
        this.area = area;
    }

    PhotoTokenAM(String area) {
        this.ar = true;
        this.area = area;
    }

    PhotoTokenAM(boolean ar) {
        this.ar = ar;
    }

    @Override
    public Role[] getRoles() {
        return this.roles;
    }

    @Override
    public PhotoTokenAM getAction() {
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
