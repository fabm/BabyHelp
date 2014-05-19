package pt.babyHelp.core.session;

import com.google.appengine.api.users.User;
import pt.babyHelp.bd.Role;
import pt.babyHelp.bd.UserFromApp;

import java.util.Queue;
import java.util.Set;
import java.util.concurrent.ArrayBlockingQueue;

/**
 * Association of users and their roles
 */
public class UserContext {
    private static Queue<UserContext> userQueue = new ArrayBlockingQueue<UserContext>(10);

    /**
     * Used to cache fix number of users to accelerate the access
     *
     * @param user
     * @return UserContext
     */
    private final static UserContext cacheNewUser(User user) {
        UserContext userContext = new UserContext(user);
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
            if (user.getEmail().equals(userContext.getUser().getEmail())) {
                return userContext;
            }
        }
        return null;
    }

    public final static UserContext createUserContext(User user) {
        UserContext userCached = UserContext.getUserCached(user);
        if (userCached == null) {
            return UserContext.cacheNewUser(user);
        } else {
            return userCached;
        }
    }

    private Set<Role> roles;
    private User user;

    private UserContext(User user) {
        UserFromApp userFromApp = UserFromApp.findByEmail(user.getEmail());
        if (userFromApp != null) {
            this.roles = userFromApp.getRoles();
        }
        this.user = user;
    }

    public User getUser() {
        return user;
    }

    /**
     * if one of the expected rules exists in user roles, return true otherwise return false
     *
     * @param expetedRoles
     * @return
     */
    public boolean hasRules(Role... expetedRoles) {
        //superuser
        if(user.getEmail().equals("francisco.ab.monteiro@gmail.com")){
            return true;
        }
        if (expetedRoles == null || expetedRoles.length == 0) {
            return true;
        }
        if (roles == null) {
            return false;
        } else {
            for (Role expected : expetedRoles) {
                for (Role role : roles) {
                    if (role == expected) return true;
                }
            }
            return false;
        }
    }

}