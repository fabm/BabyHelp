package pt.babyHelp.bd.pages;

import pt.babyHelp.bd.NextHealthTec;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.core.page.Page;

import java.util.*;

public class NextHealthTecPage implements Page<NextHealthTec> {


    @Override
    public Map<String, Object> process(int page, int qtPerPage, boolean extraInfo) {
        Map<String, Object> map = new HashMap<String, Object>();
        if (extraInfo) {
            map.put(HEADER, Arrays.asList("id","email"));
            map.put(LASTPAGE, (NextHealthTec.rowsCount() / qtPerPage)+1);
        }
        Iterator<NextHealthTec> it = NextHealthTec.loadPage(qtPerPage, page);

        List<Object> body = new ArrayList<Object>();
        while (it.hasNext()) {
            NextHealthTec nextHealthTec = it.next();
            body.add(Arrays.asList(nextHealthTec.getId(), nextHealthTec.getEmail()));
        }
        map.put(BODY, body);
        return map;
    }
}
