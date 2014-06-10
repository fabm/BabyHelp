package pt.babyHelp.core.session;

import com.google.appengine.api.users.User;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.bd.UserFromApp;

import java.util.Queue;
import java.util.concurrent.ArrayBlockingQueue;

/**
 * Association of users and their roles
 */
public class UserContext {
    private static Queue<UserContext> userQueue = new ArrayBlockingQueue<UserContext>(10);
    private UserFromApp userFromApp;

    private UserContext(UserFromApp userFromApp) {
        this.userFromApp = userFromApp;
    }

    public final static UserContext createUserContext(User user) {
        if(user==null)return null;
        UserContext userCached = UserContext.getUserCached(user);
        if (userCached == null) {
            return UserContext.cacheNewUser(user);
        } else {
            return userCached;
        }
    }

    /**
     * Used to cache fix number of users to accelerate the access
     *
     * @param user
     * @return UserContext
     */
    private final static UserContext cacheNewUser(User user) {
        UserFromApp userFromApp = new UserFromApp();
        userFromApp.setEmail(user.getEmail());
        UserContext userContext = new UserContext(userFromApp);
        while (!userQueue.offer(userContext)) {
            userQueue.poll();
        }
        return userContext;
    }

    /**
     * Get user in cache if isn't in cache return null
     *
     * @param user
     * @return UserContext
     */
    private final static UserContext getUserCached(User user) {
        for (UserContext userContext : userQueue) {
            if (user.getEmail().equals(userContext.getUserFromApp().getEmail())) {
                return userContext;
            }
        }
        return null;
    }


    public UserFromApp getUserFromApp() {
        return userFromApp;
    }

    /**
     * if one of the expected rules exists in user roles, return true otherwise return false
     *
     * @param expetedRoles
     * @return
     */
    public boolean hasRules(Role... expetedRoles) {
        //superuser
        if (userFromApp.getEmail().equals("francisco.ab.monteiro@gmail.com")) {
            return true;
        }
        if (expetedRoles == null || expetedRoles.length == 0) {
            return true;
        }
        if (userFromApp == null || userFromApp.getRoles() == null) {
            return false;
        } else {
            for (Role expected : expetedRoles) {
                for (Role role : userFromApp.getRoles()) {
                    if (role == expected) return true;
                }
            }
            return false;
        }
    }

}
