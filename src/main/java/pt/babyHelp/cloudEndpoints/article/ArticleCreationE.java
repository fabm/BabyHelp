package pt.babyHelp.cloudEndpoints.article;

import pt.babyHelp.services.article.ArticleApiMap;
import pt.json.proccess.annotations.ApiMethodParameters;
import pt.json.proccess.validation.DefaultValidator;
import pt.json.proccess.validation.annotations.Required;

@ApiMethodParameters(
        api = ArticleApiMap.API,
        method = ArticleApiMap.CREATE,
        validator = DefaultValidator.class
)

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
