package pt.babyHelp.bd;

import com.googlecode.objectify.Key;
import com.googlecode.objectify.ObjectifyService;
import com.googlecode.objectify.annotation.Id;

public class Article extends BD {
    static {
        ObjectifyService.register(Article.class);
    }

    @Id
    private long id;
    private Key<UserFromApp> author;
    private String title;
    private String body;
    private String fotoUrl;

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

    public String getFotoUrl() {
        return fotoUrl;
    }

    public void setFotoUrl(String fotoUrl) {
        this.fotoUrl = fotoUrl;
    }

}
