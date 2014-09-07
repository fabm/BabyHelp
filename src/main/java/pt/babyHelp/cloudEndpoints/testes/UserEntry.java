package pt.babyHelp.cloudEndpoints.testes;

import java.util.List;

public class UserEntry {
    private String email;
    private List<String> roles;
    private boolean registered;
    private String name;
    private boolean logged;
    private String profession;
    private boolean loadFromDS = false;


    public boolean isLoadFromDS() {
        return loadFromDS;
    }

    public void setLoadFromDS(boolean loadFromDS) {
        this.loadFromDS = loadFromDS;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public boolean isRegistered() {
        return registered;
    }

    public void setRegistered(boolean registered) {
        this.registered = registered;
    }

    public boolean isLogged() {
        return logged;
    }

    public void setLogged(boolean logged) {
        this.logged = logged;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

}