package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

@Entity
public class UserFromApp extends BD implements Serializable {

    @Id
    @Index
    private String email;
    private Set<Role> roles;

    public static UserFromApp findByEmail(String email) {
        return BD.ofy().load().type(UserFromApp.class).filter("email = ", email).first().now();
    }

    public static Iterator<UserFromApp> iterateAll() {
        return BD.loadALL(UserFromApp.class);
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Key<BD> save() throws PersistenceException {
        return super.save();
    }

    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public void setRoles(Role... roles) {
        this.roles = new HashSet<Role>(roles.length);
        for (Role role : roles) {
            this.roles.add(role);
        }
    }

    public synchronized boolean removeRole(String strRole) {
        if (this.roles == null) return false;
        return this.roles.remove(Role.convert(strRole));
    }

    public synchronized boolean addRole(String strRole) {
        if (this.roles == null) return false;
        return this.roles.add(Role.convert(strRole));
    }
}
