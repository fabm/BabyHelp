package pagination;

import com.googlecode.objectify.cmd.Query;
import environment.Environment;
import org.junit.Rule;
import org.junit.Test;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.NextHealthTec;
import pt.babyHelp.bd.PersistenceException;

import java.util.Iterator;

public class Pagination {
    @Rule
    public Environment ed = new Environment(false);

    public void enterRegisters() {
        for (int i = 0; i < 100; i++) {
            String id = String.valueOf(i);
            NextHealthTec nextHealthTec = new NextHealthTec();
            nextHealthTec.setId(Long.valueOf((100-i)));
            nextHealthTec.setEmail(id);
            try {
                nextHealthTec.save();
            } catch (PersistenceException e) {

            } catch (NextHealthTec.MissingEmail mm){

            }
        }
    }

    @Test
    public void readTotal() {
        System.out.println("Without pagination");
        enterRegisters();
        Query<NextHealthTec> query = BD.ofy().load().type(NextHealthTec.class);

        for (NextHealthTec nht : query.iterable()) {
            System.out.println("id:" + nht.getId() + " oid:" + nht.getEmail());
        }
    }

    @Test
    public void readPaginatedWithoutInterface() {
        int page = 0;
        int qtPerPage = 10;
        System.out.println("With pagination and without interface");
        enterRegisters();
        Query<NextHealthTec> queryTotal = BD.ofy().load().type(NextHealthTec.class).order("-id");
        Query<NextHealthTec> queryPag = queryTotal.limit(qtPerPage);

        Iterator<NextHealthTec> iterator = queryPag.iterator();
        while (iterator.hasNext()) {
            System.out.println("Página " + page);
            while (iterator.hasNext()) {
                NextHealthTec nht = iterator.next();
                System.out.println("id:" + nht.getId() + " oid:" + nht.getEmail());
            }
            queryPag = queryTotal.limit(qtPerPage).offset(++page * qtPerPage);
            iterator = queryPag.iterator();
        }
    }

}
