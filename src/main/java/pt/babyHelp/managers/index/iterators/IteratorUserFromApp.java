package pt.babyHelp.managers.index.iterators;

import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.UserFromApp;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 10/11/13
 * Time: 23:57
 * To change this template use File | Settings | File Templates.
 */
public class IteratorUserFromApp implements Iterator<Integer> {
    private Iterator<UserFromApp> iterator;
    private List<Long> ids;
    private UserFromApp current;
    private int i=0;

    public IteratorUserFromApp(){
        iterator = BD.ofy().load().type(UserFromApp.class).iterator();
        ids = new ArrayList<Long>();
    }

    public List<Long> getIds() {
        return ids;
    }

    @Override
    public Integer next() {
        current = iterator.next();
        ids.add(getId());
        return i++;
    }

    @Override
    public void remove() {
        throw new UnsupportedOperationException();
    }

    @Override
    public boolean hasNext() {
        return iterator.hasNext();
    }

    public String getEmail() {
        return current.getEmail();
    }

    public Long getId() {
        return current.getId();
    }

    public List<Long> getIDsList() {
        return ids;
    }
}
