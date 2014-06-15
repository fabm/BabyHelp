package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.Objectify;
import com.googlecode.objectify.ObjectifyService;
import pt.babyHelp.core.cloudEndpoints.EndPointError;
import pt.babyHelp.services.BabyHelpConstants;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class BD {

    static {
        ObjectifyService.register(UserFromApp.class);
        ObjectifyService.register(Article.class);
        ObjectifyService.register(Son.class);
        ObjectifyService.register(Parentality.class);
        ObjectifyService.register(PendingParentality.class);
    }

    public static Objectify ofy() {
        return ObjectifyService.ofy();
    }

    public static <T>Key<T> checkKey(Key<T> key,Class<T> clazz) throws EndPointError {
        if(key == null)throw new EndPointError(BabyHelpConstants.Error.PERSIST,clazz.getSimpleName());
        return key;
    }

    public static <T> List<Key<T>> keys(Class<T> entityClass, long...ids){
        List<Key<T>> list = new ArrayList<Key<T>>(ids.length);
        for (long id:ids){
            Key<T> key = Key.create(entityClass, id);
            list.add(Key.create(entityClass,id));
        }
        return list;
    }
    public static <T> List<Key<T>> keys(Class<T> entityClass, String...ids){
        List<Key<T>> list = new ArrayList<Key<T>>(ids.length);
        for (String id:ids){
            list.add(Key.create(entityClass,id));
        }
        return list;
    }

    protected synchronized static <T> Iterator<T> loadIterablePage(Class<T> cl, int itemsPerPage, int page) {
        Iterator<T> iterator;
            iterator =
                    BD.ofy().load().type(cl).
                    limit(itemsPerPage).
                    offset(itemsPerPage * (page - 1))
                    .iterator()
            ;
        return iterator;
    }

    protected static <T> Map<String, T> loadIDs(Class<T> cl, String... ids) {
        return BD.ofy().load().type(cl).ids(ids);
    }


    protected static <S, T> Map<S, T> loadIDs(Class<T> cl, Iterable<S> iterable) {
        return BD.ofy().load().type(cl).ids(iterable);
    }

    protected static int rowsCount(Class<?> cl) {
        return BD.ofy().load().type(cl).count();
    }

    protected static <T> T load(Class<T> cl, Long id) {
        return BD.ofy().load().type(cl).id(id).safe();
    }

    protected static <T> Iterator<T> loadALL(Class<T> cl) {
        return BD.ofy().load().type(cl).iterator();
    }

    protected static <T> T load(Class<T> cl, String id) {
        return BD.ofy().load().type(cl).id(id).safe();
    }


    public void delete() {
        BD.ofy().delete().entity(this).now();
    }


    public static void register(Class<?> clazz) {
        ObjectifyService.register(clazz);
    }


}
