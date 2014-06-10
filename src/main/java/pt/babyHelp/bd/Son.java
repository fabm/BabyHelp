package pt.babyHelp.bd;

import com.googlecode.objectify.Key;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;


public class Son {
    private String photoKey;
    private Date birthDate;
    private String livesWith;
    private List<Key<UserFromApp>> parents = new ArrayList<Key<UserFromApp>>();

    public List<Key<UserFromApp>> getParents() {
        return parents;
    }

    public void setParents(List<Key<UserFromApp>> parents) {
        this.parents = parents;
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

    public String getLivesWith() {
        return livesWith;
    }

    public void setLivesWith(String livesWith) {
        this.livesWith = livesWith;
    }
}
