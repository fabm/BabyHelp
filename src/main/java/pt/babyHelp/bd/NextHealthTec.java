package pt.babyHelp.bd;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

/**
 * Created with IntelliJ IDEA.
 * UserFromApp: francisco
 * Date: 02/11/13
 * Time: 22:35
 * To change this template use File | Settings | File Templates.
 */

@Entity
public class NextHealthTec extends BD {

    @Id
    private Long id;
    @Index
    private String email;


    public static NextHealthTec load(String email){
        return BD.ofy().load().type(NextHealthTec.class).filter("email =", email).first().now();
    }

    public static boolean isApplyedTecSaude(final String email) {
        NextHealthTec nts = NextHealthTec.load(email);
        if (nts != null) {
            UserFromApp user = UserFromApp.create();
            user.setHealthTec(true);
            user.save();
            return true;
        }
        return false;
    }

    public static void setNext(String email) {
        NextHealthTec nextHealthTec = NextHealthTec.load(email);
        if(nextHealthTec!=null)throw new IllegalArgumentException("There are already an " +
                "NextHealthTec object with the same email");
        NextHealthTec ntt = new NextHealthTec();
        ntt.email = email;
        ntt.save();
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }
}
