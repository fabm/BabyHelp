package pt.babyHelp.bd;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

@Entity
public class UserFromApp<T extends Enum<T>> {

    private String profession;
    @Id
    @Index
    private String email;
    @Index

    private String name;
    private Set<T> roles;
    private Set<Son> sons;

    public static UserFromApp findByEmail(String email) {
        return BD.ofy().load().type(UserFromApp.class).id(email).now();
    }

    public static Iterator<UserFromApp> iterateAll() {
        return BD.loadALL(UserFromApp.class);
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
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


    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }


    public Set<T> getRoles() {
        return roles;
    }

    public void setRoles(T... roles) {
        this.roles = new HashSet<T>(roles.length);
        for (T role : roles) {
            this.roles.add(role);
        }
    }

    public void setRoles(Set<T> roles) {
        this.roles = roles;
    }


}
