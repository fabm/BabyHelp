package pt.babyHelp.bd;

import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Subclass;

public class HealhTec{

    String name;
    String profession;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }
}
