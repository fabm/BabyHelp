package pt.babyHelp.bd;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

import java.util.Date;

@Entity
public class PendingParentality {
    @Id
    Long id;

    String askedFor;

    @Index
    String parent;

    Date date;
    Long SonId;

    public Long getSonId() {
        return SonId;
    }

    public void setSonId(Long sonId) {
        SonId = sonId;
    }

    public String getAskedFor() {
        return askedFor;
    }

    public void setAskedFor(String askedFor) {
        this.askedFor = askedFor;
    }

    public String getParent() {
        return parent;
    }

    public void setParent(String parent) {
        this.parent = parent;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
