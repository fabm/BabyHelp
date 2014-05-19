package pt.babyHelp.bd;

import com.google.appengine.api.users.User;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Ignore;

import java.util.Calendar;

@Entity
public class SessionEntity extends BD {
    static {
        ObjectifyService.register(SessionEntity.class);
    }
    private Calendar closed;
    private Calendar init;

    public String getId() {
        return id;
    }

    @Id
    private String id;
    private User user;
    @Ignore
    private Calendar lastCall;

    @Override
    public boolean equals(Object obj) {
        if(!(obj instanceof SessionEntity)){
            return false;
        }
        if(id == null){
            return false;
        }
        return id == ((SessionEntity)obj).id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Calendar getLastTime() {
        return closed;
    }

    public void setLastTime(Calendar lastTime) {
        this.closed = lastTime;
    }

    public Calendar getInit() {
        return init;
    }

    public void setInit(Calendar init) {
        this.init = init;
    }

    public static SessionEntity findOpenByUser(User user){
        return BD.ofy().load().type(SessionEntity.class).filter("user = ", user).filter("closed = ",null).first().now();
    }
}
