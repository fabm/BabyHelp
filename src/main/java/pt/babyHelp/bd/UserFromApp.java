package pt.babyHelp.bd;

import com.google.api.client.repackaged.org.apache.commons.codec.binary.Base64;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Serializable;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
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

    public void createHash(String pass) throws NoSuchAlgorithmException {
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(pass.getBytes());
        byte[] dg = md.digest();
        hash = Base64.encodeBase64(dg).toString();
        dateHash = Calendar.getInstance().getTime();
    }

    public boolean isValid(String pass, HttpServletResponse res) throws NoSuchAlgorithmException {
        Calendar m30 = Calendar.getInstance();
        m30.add(Calendar.MINUTE,30);
        if(m30.after(dateHash))
            return false;
        MessageDigest md = MessageDigest.getInstance("SHA-256");
        md.update(pass.getBytes());
        byte[] dg = md.digest();
        String currentHash = Base64.encodeBase64(dg).toString();

        try {
            res.getWriter().println("current hash:"+currentHash);
            res.getWriter().println("stored hash:"+hash);
        } catch (IOException e) {
            e.printStackTrace();
        }

        return currentHash.equals(hash);
    }

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

}
