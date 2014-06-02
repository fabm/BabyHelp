package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;

@Entity
public class UploadToken {
    static {
        ObjectifyService.register(UploadToken.class);
    }

    private Key<UserFromApp> userFromApp;
    @Id
    private String token;

    public Key<UserFromApp> getUserFromApp() {
        return userFromApp;
    }

    public void setUserFromApp(Key<UserFromApp> userFromApp) {
        this.userFromApp = userFromApp;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
