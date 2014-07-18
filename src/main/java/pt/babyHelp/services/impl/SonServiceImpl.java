package pt.babyHelp.services.impl;


import com.google.appengine.api.users.User;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.Parentality;
import pt.babyHelp.bd.Son;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.services.SonService;
import pt.gapiap.cloud.endpoints.Authorization;

import java.util.*;

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
