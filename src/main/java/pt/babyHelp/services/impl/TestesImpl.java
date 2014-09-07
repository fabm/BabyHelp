package pt.babyHelp.services.impl;


import com.google.appengine.api.users.User;
import com.googlecode.objectify.Key;
import pt.babyHelp.bd.BD;
import pt.babyHelp.bd.MyDate;
import pt.babyHelp.bd.Parentality;
import pt.babyHelp.bd.Son;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.cloudEndpoints.testes.SonParameter;
import pt.gapiap.cloud.endpoints.errors.CEError;
import pt.gapiap.services.UserAcessible;

import java.util.*;

public class TestesImpl implements UserAcessible {

    private BHAuthorization authorization;

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

    public Map<String, Object> insertSuns() throws CEError {
        Map<String, Object> map = new HashMap<String, Object>();

        for (SonParameter sonParameter : putSomeValuesForMe()) {

            Son son = new Son();
            MyDate bdParameter = sonParameter.getBirthDay();
            Calendar calendar = new GregorianCalendar(bdParameter.getYear(), bdParameter.getMonth() - 1, bdParameter.getDay());
            son.setBirthDate(calendar.getTime());
            son.setName(sonParameter.getName());
            son.setPhotoKey(sonParameter.getPhotokey());

            String sonName = BD.checkKey(BD.ofy().save().entity(son).now(), Son.class).getName();
            String userParentEmail = getAuthorization().savedUser().getEmail();

            Parentality parentality = new Parentality();
            parentality.setUserFromAppEmail(userParentEmail);
            parentality.setSonName(sonName);

            Key<Parentality> id = BD.ofy().save().entity(parentality).now();
            BD.checkKey(id, Parentality.class);

        }
        map.put("created", "parentality");
        return map;
    }

    @Override
    public void setUser(User user) {
        authorization = new BHAuthorization();
        authorization.init(user);
    }

    @Override
    public BHAuthorization getAuthorization() {
        return authorization;
    }


}
