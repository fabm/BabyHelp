package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@Entity
public class Son {
    static {
        ObjectifyService.register(Son.class);
    }

    private List<Key<UserFromApp>> parentsList = null;
    private String photoKey;
    private Date birthDate;
    private String livesin;

    public String getLivesin() {
        return livesin;
    }

    public void setLivesin(String livesin) {
        this.livesin = livesin;
    }

    public String getPhotoKey() {
        return photoKey;
    }

    public void setPhotoKey(String photoKey) {
        this.photoKey = photoKey;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public List<Key<UserFromApp>> getParentsList() {
        if (parentsList == null) parentsList = new ArrayList<Key<UserFromApp>>();
        return parentsList;
    }


}
