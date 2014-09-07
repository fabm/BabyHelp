package pt.babyHelp.cloudEndpoints.article;

import pt.babyHelp.services.article.ArticleApiMap;
import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.defaultValidator.DefaultValidator;

import javax.validation.constraints.NotNull;

@ApiMethodParameters(
        api = ArticleApiMap.API,
        method = ArticleApiMap.CREATE,
        validators = DefaultValidator.class
)

public class ArticleCreationE {
    @NotNull
    private String title;

    private String photoToken;
    @NotNull
    private String body;

    @NotNull
    private String summary;

    @NotNull
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
