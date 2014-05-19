package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.util.Iterator;
import java.util.Map;

@Entity
public class NextHealthTec extends BD {
    @Id
    private Long id;
    @Index
    private String email;

    public static NextHealthTec load(Long id) {
        return BD.load(NextHealthTec.class, id);
    }

    public static NextHealthTec findByEmail(String email) {
        return BD.ofy().load().type(NextHealthTec.class).filter("email = ", email).first().now();
    }

    public static int rowsCount() {
        return BD.rowsCount(NextHealthTec.class);
    }

    public static Iterator<NextHealthTec> loadPage(int itemsPerPage, int page) {
        return BD.loadIterablePage(NextHealthTec.class, itemsPerPage, page);
    }

    public static Map<Long, NextHealthTec> getMap(Iterable<Long> iterable) {
        return BD.loadIDs(NextHealthTec.class, iterable);
    }

    public static Iterator<NextHealthTec> loadAll() {
        return BD.loadALL(NextHealthTec.class);
    }

    public String getEmail() {
        return email;
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

    @Override
    public Key<BD> save() throws PersistenceException {
        if (NextHealthTec.findByEmail(this.email) != null) throw new MissingEmail();
        return super.save();
    }

    public class MissingEmail extends RuntimeException {

    }

}
