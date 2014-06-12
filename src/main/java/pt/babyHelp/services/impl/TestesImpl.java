package pt.babyHelp.services.impl;


import com.google.appengine.api.users.User;
import com.googlecode.objectify.Key;
import com.googlecode.objectify.cmd.Query;
import pt.babyHelp.bd.*;
import pt.babyHelp.core.endpoints.EndPointError;
import pt.babyHelp.endPoints.Authorization;
import pt.babyHelp.endPoints.UserAcessible;
import pt.babyHelp.endPoints.testes.SonParameter;
import pt.babyHelp.endPoints.userEndPoint.SonsParameters;

import java.util.*;

public class TestesImpl implements UserAcessible {
    private Authorization authorization;

    private SonParameter putSomeValuesForMe(){
        SonParameter sonParameter = new SonParameter();
        MyDate myDate = new MyDate();
        myDate.setDay(25);
        myDate.setMonth(5);
        myDate.setYear(2000);
        sonParameter.setBirthDay(myDate);
        sonParameter.setName("test name");
        sonParameter.setPhotokey("asddfhnrtnas");
        return sonParameter;
    }

    public Map<String, Object> insertSun() throws EndPointError {
        SonParameter sonParameter = putSomeValuesForMe();
        Map<String, Object> map = new HashMap<String, Object>();

        Son son = new Son();
        MyDate bdParameter = sonParameter.getBirthDay();
        Calendar calendar = new GregorianCalendar(bdParameter.getYear(), bdParameter.getMonth() - 1, bdParameter.getDay());
        son.setBirthDate(calendar.getTime());
        son.setName(sonParameter.getName());
        son.setPhotoKey(sonParameter.getPhotokey());

        Key<Son> sonKey = BD.checkKey(BD.ofy().save().entity(son).now(), Son.class);
        Key<UserFromApp> userParentKey = Key.create(getAuthorization().savedUserFromApp());

        Parentality parentality = new Parentality();
        parentality.setConfirmed(true);
        parentality.setUserFromApp(userParentKey);
        parentality.setSon(sonKey);

        Key<Parentality> id = BD.ofy().save().entity(parentality).now();
        BD.checkKey(id, Parentality.class);

        map.put("created", "parentality");
        return map;
    }


    public Map<String, Object> getSonsList() throws EndPointError {


        Key<UserFromApp> uk = Key.create(getAuthorization().getUserFromApp());

        Query<Parentality> loaded = BD.ofy().load().type(Parentality.getThisClass()).filter("userFromApp = ", uk);

        List<Map<String, Object>> sonList = new ArrayList<Map<String, Object>>();

        List<String> sonsName = new ArrayList<String>();

        String names[] = new String[loaded.count()];
        Key<Son> keys[] = new Key[loaded.count()];


        int i = 0;
        for (Parentality par : loaded) {
            names[i] = par.getSon().getName();
            keys[i] = par.getSon();
            i++;
        }


        Map<String, Object> sonMap = new HashMap<String, Object>();
        Map<String, Son> m = BD.ofy().load().type(Son.class).ids(names);
        Collection<Son> values = m.values();

        for (Son son : values) {
            sonMap.put("name", son.getName());
            sonMap.put("birthDate", son.getBirthDate());
            sonMap.put("photoKey", son.getPhotoKey());
            sonList.add(sonMap);
        }

        Map<String, Object> map = new HashMap<String, Object>();
        map.put("lista", sonList);

        return map;
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

}