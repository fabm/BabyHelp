package pt.babyHelp.endPoints.testes;

import pt.babyHelp.bd.embededs.Role;

import java.util.List;

public class UserEntry {
    private String email;
    private List<String> roles;
    private boolean registered;
    private boolean logged;

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
}