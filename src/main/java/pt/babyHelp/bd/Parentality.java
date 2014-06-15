package pt.babyHelp.bd;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Parentality {

    @Id
    private Long id;
    @Index
    private String userFromAppEmail;
    @Index
    private String sonName;

    public static Class<Parentality> getThisClass() {
        return Parentality.class;
    }

    public Long getId() {
        return id;
    }

    public String getUserFromAppEmail() {
        return userFromAppEmail;
    }

    public void setUserFromAppEmail(String userFromAppEmail) {
        this.userFromAppEmail = userFromAppEmail;
    }

    public String getSonName() {
        return sonName;
    }

    public void setSonName(String sonName) {
        this.sonName = sonName;
    }
}
