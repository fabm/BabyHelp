package user;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;
import environment.Environment;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.UserFromApp;

import java.lang.reflect.Field;

public class UsersPersistence {
    private static String[] ordinal = new String[]{
            "first", "second", "third"
    };
    @Rule
    public Environment store = new Environment(true);

    @Test
    public void testBattery() throws NoSuchFieldException, IllegalAccessException, InstantiationException{
        saveAndSearch();
        updateAndRoles();
    }

    public void saveAndSearch() throws NoSuchFieldException, IllegalAccessException, InstantiationException {


        UserService userService = UserServiceFactory.getUserService();
        Assert.assertTrue(userService.isUserAdmin());

        UserFromApp userFromApp = new UserFromApp();
        userFromApp.setEmail(createUser(3).getEmail());

        Assert.assertEquals(1, BD.ofy().load().type(UserFromApp.class).list().size());
        UserFromApp saved = BD.ofy().load().type(UserFromApp.class).first().now();
        Assert.assertNotNull(saved);

        userFromApp = new UserFromApp();
        userFromApp.setEmail(createUser(1).getEmail());

        userFromApp = new UserFromApp();
        userFromApp.setEmail(createUser(2).getEmail());

        Assert.assertEquals(3, BD.ofy().load().type(UserFromApp.class).list().size());
        UserFromApp located = BD.ofy().load().type(UserFromApp.class).filter("user = ", createUser(1)).first().now();

        Assert.assertEquals("first@mail.pt", located.getEmail());
    }

    public void updateAndRoles() throws NoSuchFieldException, IllegalAccessException{
        UserFromApp user = BD.ofy().load().type(UserFromApp.class).filter("user = ", createUser(2)).first().now();
        //user.createRoles();
        //user.getRoles().add(Role.HEALTHTEC);
        user = null;

        user = BD.ofy().load().type(UserFromApp.class).filter("user = ", createUser(2)).first().now();
        //Assert.assertTrue(user.getRoles().contains(Role.HEALTHTEC));
        user = null;

        user = BD.ofy().load().type(UserFromApp.class).filter("user = ", createUser(2)).first().now();
        //user.getRoles().remove(Role.HEALTHTEC);
        //user.getRoles().add(Role.ADMINISTRATOR);

        //Assert.assertTrue(!user.getRoles().contains(Role.HEALTHTEC));
        //Assert.assertTrue(user.getRoles().contains(Role.ADMINISTRATOR));

    }

    private User createUser(int id) throws NoSuchFieldException, IllegalAccessException {
        User user = new User(ordinal[id - 1] + "@mail.pt", "domain");
        setUser(user, "" + id);
        return user;
    }

    public void setUser(User user, String id) throws NoSuchFieldException, IllegalAccessException {
        Field userIdField = User.class.getDeclaredField("userId");
        userIdField.setAccessible(true);
        userIdField.set(user, id);
    }
}
