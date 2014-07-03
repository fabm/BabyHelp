package pt.babyHelp.cloudEndpoints.article;

import com.annotation.processor.validation.Required;
import pt.babyHelp.services.BabyHelp;

import java.util.Map;

public class ArticleCreationE {
    @Required
    private String title;

    private String photoToken;
    @Required
    private String body;

    @Required
    private String summary;

    @Required
    private boolean isPublic;


    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getPhotoToken() {
        return photoToken;
    }

    public void setPhotoToken(String photoToken) {
        this.photoToken = photoToken;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public void setPublic(boolean isPublic) {
        this.isPublic = isPublic;
    }
}
