package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.io.Serializable;
import java.util.*;

@Entity
public class UserFromApp extends BD implements Serializable {
    static {
        ObjectifyService.register(UserFromApp.class);
    }

    @Id
    @Index
    private String email;
    @Index
    private String hash;
    private Date dateHash;

    private Set<Role> roles;
    private List<Son> sons;

    public static UserFromApp findByEmail(String email) {
        return BD.ofy().load().type(UserFromApp.class).filter("email = ", email).first().now();
    }

    public static Iterator<UserFromApp> iterateAll() {
        return BD.loadALL(UserFromApp.class);
    }

    public List<Son> getSons() {
        if(sons==null)sons= new ArrayList<Son>();
        return sons;
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

    public void setRoles(Role... roles) {
        this.roles = new HashSet<Role>(roles.length);
        for (Role role : roles) {
            this.roles.add(role);
        }
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

}
