package pt.babyHelp.bd;

import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.util.Date;

@Entity
public class UploadToken {
    static {
        ObjectifyService.register(UploadToken.class);
    }

    public UploadToken() {
        this.timestamp = new Date();
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAuthToken() {
        return authToken;
    }

    public void setAuthToken(String authToken) {
        this.authToken = authToken;
    }

    @Index
    private String email;
    @Index
    private String authToken;
    @Index
    private Date timestamp;
    @Id
    private String id;
}
