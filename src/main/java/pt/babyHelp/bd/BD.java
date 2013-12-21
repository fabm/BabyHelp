package pt.babyHelp.bd;

/**
 * Created with IntelliJ IDEA.
 * Caster: francisco
 * Date: 19/10/13
 * Time: 13:11
 * To change this template use File | Settings | File Templates.
 */

import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;

public class BD {
    static {
        ObjectifyService.register(Foto.class);
        ObjectifyService.register(UserFromApp.class);
        ObjectifyService.register(NextHealthTec.class);
    }

    public static Objectify ofy() {
        return ObjectifyService.ofy();
    }


    public static<T> T load(Class<T> cl,Long id){
        return BD.ofy().load().type(cl).id(id).now();
    }

    public static<T> T load(Class<T> cl,String id){
        return BD.ofy().load().type(cl).id(id).now();
    }

    public void save() {
        BD.ofy().save().entity(this).now();
    }
    public void delete() {
        BD.ofy().delete().entity(this).now();
    }

}
