package pt.babyHelp.services.impl;


import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.Parentality;
import pt.babyHelp.bd.Son;
import pt.gapiap.cloud.endpoints.authorization.Authorization;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class SonServiceImpl {

    private Authorization authorization;

    private Collection<Son> queriedSonsFromEmail(String email) {

        Query<Parentality> loaded = BD.ofy().load().type(Parentality.class).filter("userFromAppEmail = ", email);


        List<String> sonIds = new ArrayList<String>(loaded.count());

        for (Parentality par : loaded) {
            sonIds.add(par.getSonName());
        }
        return BD.ofy().load().type(Son.class).ids(sonIds).values();
    }


}
