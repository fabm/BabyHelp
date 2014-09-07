package pt.babyHelp.bd;

import com.google.appengine.api.users.User;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import pt.babyHelp.bd.embededs.Role;
import pt.gapiap.cloud.endpoints.authorization.UserWithRoles;

import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

@Entity
public class UserFromApp implements UserWithRoles<Role> {

  private String profession;
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
    if (sons == null) {
      sons = new HashSet<Son>();
    }
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


  @Override
  public Set<Role> getRoles() {
    return roles;
  }

  public void setRoles(Set<Role> roles) {
    this.roles = roles;
  }

  @Override
  public void setUser(User user) {
    email = user.getEmail();
  }

  public void setRoles(Role... roles) {
    this.roles = new HashSet<Role>(roles.length);
    for (Role role : roles) {
      this.roles.add(role);
    }
  }


}
