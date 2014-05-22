package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.io.Serializable;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

@Entity
public class UserFromApp extends BD implements Serializable {
    static {
        ObjectifyService.register(UserFromApp.class);
    }

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

    public UserFromApp loadOrSave() throws PersistenceException {

        UserFromApp userFromApp;
        if (email != null && !email.isEmpty()) {
            userFromApp = UserFromApp.findByEmail(this.email);
            if (userFromApp != null)
                return userFromApp;
            else {
                save();
                return this;
            }
        }
        return null;
    }
}
