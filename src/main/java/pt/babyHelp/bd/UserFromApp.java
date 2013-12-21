package pt.babyHelp.bd;


import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;
import pt.babyHelp.utils.Caster;

import javax.servlet.http.HttpSession;
import java.io.Serializable;

/**
 * Created with IntelliJ IDEA.
 * UserFromApp: francisco
 * Date: 02/11/13
 * Time: 22:35
 * To change this template use File | Settings | File Templates.
 */

@Entity
public class UserFromApp extends BD implements Serializable{

    @Id
    private Long id;
    @Index
    private String email;
    private String originalID;
    private boolean healthTec = false;

    public static UserFromApp create() {
        UserFromApp userFromApp;
        if (!UserServiceFactory.getUserService().isUserLoggedIn()) {
            userFromApp = BD.ofy().load().type(UserFromApp.class).filter("originalID =",
                    UserServiceFactory.getUserService().getCurrentUser().getUserId()).first().now();
            if(userFromApp == null){
                userFromApp = new UserFromApp();
            }
        } else {
            User cu = UserServiceFactory.getUserService().getCurrentUser();
            userFromApp = BD.load(UserFromApp.class,cu.getUserId());
            if (userFromApp == null) {
                userFromApp = new UserFromApp();
                userFromApp.email = cu.getEmail();
            }
        }
        return userFromApp;
    }

    public static UserFromApp create(HttpSession session){
        try{
            return Caster.cast(session.getAttribute("userFromApp"));
        }catch (NullPointerException npe){
            UserFromApp userFromApp = UserFromApp.create();
            session.setAttribute("userFromApp",userFromApp);
            return userFromApp;
        }
    }

    public Long getId() {
        return id;
    }



    public void setId(Long id) {
        this.id = id;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public void setIdFromCurrentUser() {
        this.id = Long.parseLong(UserServiceFactory.getUserService().getCurrentUser().getUserId());
    }

    public boolean isLogged() {
        return UserServiceFactory.getUserService().isUserLoggedIn();
    }

    public boolean isHealthTecSaude() {
        if(!isLogged()){
            return false;
        }
        return healthTec;
    }

    public boolean isAdmin() {
        if (!isLogged()) {
            return false;
        }
        return UserServiceFactory.getUserService().isUserAdmin();
    }

    public String getEmail(){
        return email;
    }
    public void setHealthTec(boolean healthTec){
        this.healthTec = healthTec;
    }

}
