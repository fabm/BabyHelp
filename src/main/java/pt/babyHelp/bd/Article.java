package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Entity;
import com.googlecode.objectify.annotation.Id;
import com.googlecode.objectify.annotation.Index;

@Entity
public class Article extends BD {

    @Id
    private Long id;
    @Index
    private Key<UserFromApp> author;
    private String title;
    private String body;
    private String photoUrl;

    public Long getId() {
        return id;
    }

    public Key getAuthor() {
        return author;
    }

    public void setAuthor(UserFromApp author) {
        this.author = Key.create(UserFromApp.class, author.getEmail());
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public void setPhotoUrl(String photoUrl) {
        this.photoUrl = photoUrl;
    }

}
