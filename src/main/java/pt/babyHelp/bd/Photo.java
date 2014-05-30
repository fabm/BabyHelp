package pt.babyHelp.bd;

import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Photo extends BD {

    @Id
    Long id;
    @Index
    private String blob;

    private Content content;

    public static Photo load(String blob) {
        return BD.ofy().load().type(Photo.class).filter("blob =", blob).first().now();
    }

    public String getBlob() {
        return blob;
    }

    public void setBlob(String blob) {
        this.blob = blob;
    }

    public Long getId() {
        return id;
    }

    public Content getContent() {
        return content;
    }

  }
