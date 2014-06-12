package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Parentality {

    public static Class<Parentality> getThisClass(){
        return Parentality.class;
    }

    @Id
    private Long id;
    @Index
    private Key<UserFromApp> userFromApp;
    @Index
    private Key<Son> son;
    private boolean confirmed = false;

    public Key<UserFromApp> getUserFromApp() {
        return userFromApp;
    }

    public void setUserFromApp(Key<UserFromApp> userFromApp) {
        this.userFromApp = userFromApp;
    }

    public Key<Son> getSon() {
        return son;
    }

    public void setSon(Key<Son> son) {
        this.son = son;
    }

    public boolean isConfirmed() {
        return confirmed;
    }

    public void setConfirmed(boolean confirmed) {
        this.confirmed = confirmed;
    }
}
