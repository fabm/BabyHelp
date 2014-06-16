package pt.babyHelp.bd;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import pt.babyHelp.bd.embededs.Role;

import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

@Entity
public class UserFromApp {

    HealhTec healhTec;
    @Id
    @Index
    private String email;
    @Index

    private String name;
    private Set<Role> roles;
    private Set<Son> sons;

    public static UserFromApp findByEmail(String email) {
        return BD.ofy().load().type(UserFromApp.class).id(email).now();
    }

    public static Iterator<UserFromApp> iterateAll() {
        return BD.loadALL(UserFromApp.class);
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Son> getSons() {
        if (sons == null) sons = new HashSet<Son>();
        return Collections.unmodifiableSet(sons);
    }

    public void setSons(Set<Son> sons) {
        this.sons = sons;
    }

    public HealhTec getHealhTec() {
        return healhTec;
    }

    public void setHealhTec(HealhTec healhTec) {
        this.healhTec = healhTec;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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


}
