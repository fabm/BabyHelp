package user;

import com.google.appengine.api.users.User;
import com.google.appengine.api.users.UserServiceFactory;
import environment.Environment;
import environment.Ordinals;
import org.junit.Assert;
import org.junit.Rule;
import org.junit.Test;
import pt.babyHelp.bd.*;

import java.lang.reflect.Field;
import java.util.List;

public class HealthTecAssign {
    @Rule
    public Environment ed = new Environment(false);

    private static String gmailServer="@gmail.com";

    private static String getEmail(int ordem){
        return Ordinals.getOrdinal(ordem)+gmailServer;
    }

    private User logInAsId(int id) throws NoSuchFieldException, IllegalAccessException, PersistenceException {
        return logInAsId(id,false);
    }

    private User logInAsId(int id, boolean isAdmin) throws NoSuchFieldException, IllegalAccessException, PersistenceException {
        ed.getHelper().setEnvEmail(getEmail(id));
        ed.getHelper().setEnvAuthDomain("domain");
        ed.getHelper().setEnvIsAdmin(isAdmin);
        User user = UserServiceFactory.getUserService().getCurrentUser();
        setID(user,String.valueOf(id));
        processUserInWaitingList(user);
        return user;
    }

    private UserFromApp processUserInWaitingList(User user) throws PersistenceException {
        NextHealthTec nextHelathTec = NextHealthTec.findByEmail(user.getUserId());
        if(nextHelathTec!=null){
            UserFromApp userFromApp = UserFromApp.findByEmail(user.getEmail());
            if(userFromApp == null){
                userFromApp = new UserFromApp();
                userFromApp.setEmail(user.getEmail());
                userFromApp.setRoles(Role.HEALTHTEC);
                userFromApp.save();
            }else{
                userFromApp.setRoles(Role.HEALTHTEC);
                userFromApp.save();
            }
            nextHelathTec.delete();
            return userFromApp;
        }
        return null;
    }


    /**
     * Testa a atribuição do role de técnico de saúde a um utilizador
     * @throws NoSuchFieldException
     * @throws IllegalAccessException
     */
    @Test
    public void assignHealthTecToUser() throws NoSuchFieldException, IllegalAccessException, PersistenceException {

        User user;

        Assert.assertFalse(UserServiceFactory.getUserService().isUserAdmin());

        NextHealthTec nextHealthTec = new NextHealthTec();
        nextHealthTec.setEmail("2");
        nextHealthTec.save();

        Assert.assertNotNull(nextHealthTec);

        user = logInAsId(2);

        nextHealthTec = NextHealthTec.findByEmail("2");

        Assert.assertNull(nextHealthTec);

        UserFromApp userFromApp = UserFromApp.findByEmail(user.getEmail());

        Assert.assertTrue(userFromApp.getRoles().contains(Role.HEALTHTEC));

        List<UserFromApp> list = BD.ofy().load().type(UserFromApp.class).list();

        Assert.assertSame(list.size(),1);

        userFromApp = UserFromApp.findByEmail(user.getEmail());

        Assert.assertNotNull(userFromApp);

    }




    private void setID(User user, String id) throws NoSuchFieldException, IllegalAccessException {
        Field idField = User.class.getDeclaredField("userId");
        idField.setAccessible(true);
        idField.set(user,id);
    }


}
