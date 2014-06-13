package pt.babyHelp.services.impl;


import com.google.appengine.api.users.User;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.*;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.endPoints.Authorization;
import pt.babyHelp.endPoints.UserAcessible;
import pt.babyHelp.endPoints.testes.SonParameter;

import java.util.*;

public class TestesImpl implements UserAcessible {
    private Authorization authorization;

    private List<SonParameter> putSomeValuesForMe() {
        List<SonParameter> list = new ArrayList<SonParameter>();
        SonParameter sonParameter = new SonParameter();
        MyDate myDate = new MyDate(25, 5, 2000);
        sonParameter.setBirthDay(myDate);
        sonParameter.setName("test name");
        sonParameter.setPhotokey("asddfhnrtnas");
        list.add(sonParameter);

        sonParameter = new SonParameter();
        myDate = new MyDate(10, 1, 1999);
        sonParameter.setBirthDay(myDate);
        sonParameter.setName("blabla");
        sonParameter.setPhotokey("asdfgh");
        list.add(sonParameter);

        sonParameter = new SonParameter();
        myDate = new MyDate(2, 3, 1998);
        sonParameter.setBirthDay(myDate);
        sonParameter.setName("another name");
        sonParameter.setPhotokey("xxxxxx");
        list.add(sonParameter);
        return list;
    }

    public Map<String, Object> insertSuns() throws EndPointError {
        Map<String, Object> map = new HashMap<String, Object>();

        for (SonParameter sonParameter : putSomeValuesForMe()) {

            Son son = new Son();
            MyDate bdParameter = sonParameter.getBirthDay();
            Calendar calendar = new GregorianCalendar(bdParameter.getYear(), bdParameter.getMonth() - 1, bdParameter.getDay());
            son.setBirthDate(calendar.getTime());
            son.setName(sonParameter.getName());
            son.setPhotoKey(sonParameter.getPhotokey());

            String sonName = BD.checkKey(BD.ofy().save().entity(son).now(), Son.class).getName();
            String userParentEmail = getAuthorization().savedUserFromApp().getEmail();

            Parentality parentality = new Parentality();
            parentality.setConfirmed(true);
            parentality.setUserFromAppEmail(userParentEmail);
            parentality.setSonName(sonName);

            Key<Parentality> id = BD.ofy().save().entity(parentality).now();
            BD.checkKey(id, Parentality.class);

        }
        map.put("created", "parentality");
        return map;
    }


    private Collection<Son> queriedSons() {
        String email = getAuthorization().getUserFromApp().getEmail();

        Query<Parentality> loaded = BD.ofy().load().type(Parentality.class).filter("userFromAppEmail = ", email);


        List<String> sonIds = new ArrayList<String>(loaded.count());

        for (Parentality par : loaded) {
            sonIds.add(par.getSonName());
        }
        return BD.ofy().load().type(Son.class).ids(sonIds).values();
    }

    public Map<String, Object> getSonsList() throws EndPointError {
        Map<String, Object> sonMap = new HashMap<String, Object>();
        List<Map<String, Object>> sonList = new ArrayList<Map<String, Object>>();

        for (Son son : queriedSons()) {
            sonMap.put("name", son.getName());
            sonMap.put("birthDate", son.getBirthDate());
            sonMap.put("photoKey", son.getPhotoKey());
            sonList.add(sonMap);
        }

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("lista", sonList);

        return map;
    }

    public Map<String, Object> getSonsFilters() {
        return null;
    }

    public Map<String, Object> getParentsList(String name) {

        return null;
    }

    @Override
    public void setUser(User user) {
        authorization = new Authorization(user);
    }

    @Override
    public Authorization getAuthorization() {
        return authorization;
    }

    public Map<String, Object> getParentsListQ(String q) {
        List<Map<String, Object>> sons = new ArrayList<Map<String, Object>>();
        for (Son son : queriedSons()) {
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
}
