package pt.babyHelp.services.impl;


import com.google.appengine.api.users.User;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.Parentality;
import pt.babyHelp.bd.Son;
import pt.babyHelp.endPoints.Authorization;
import pt.babyHelp.services.SonService;

import java.util.*;

public class SonServiceImpl implements SonService {

    private Authorization authorization;

    private Collection<Son> queriedSonsFromEmail(String email) {

        Query<Parentality> loaded = BD.ofy().load().type(Parentality.class).filter("userFromAppEmail = ", email);


        List<String> sonIds = new ArrayList<String>(loaded.count());

        for (Parentality par : loaded) {
            sonIds.add(par.getSonName());
        }
        return BD.ofy().load().type(Son.class).ids(sonIds).values();
    }

    public Map<String, Object> getParentsListQ(String q) {
        List<Map<String, Object>> sons = new ArrayList<Map<String, Object>>();
        for (Son son : queriedSonsFromEmail(getAuthorization().getUserFromApp().getEmail())) {
            if (son.getName().contains(q)) {
                Map<String, Object> map = new HashMap<String, Object>();
                map.put("name", son.getName());
                map.put("birthday", son.getBirthDate());
                map.put("photokey", son.getPhotoKey());
                sons.add(map);
            }
        }
        Map<String, Object> map = new HashMap<String, Object>();
        map.put("sons", sons);
        return map;
    }

    @Override
    public void setUser(User user) {
        this.authorization = new Authorization(user);
    }

    @Override
    public Authorization getAuthorization() {
        return authorization;
    }
}
