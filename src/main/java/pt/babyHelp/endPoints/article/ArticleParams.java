package pt.babyHelp.endPoints.article;

import pt.babyHelp.core.cloudEndpoints.CEPUtils;
import pt.babyHelp.core.cloudEndpoints.EndPointError;
import pt.babyHelp.services.ArticleService;

import java.util.Map;

public class ArticleParams {
    private String title;
    private String photoUrl;
    private String body;
    private String summary;
    private boolean isPublic;
    private Long id;

    public ArticleParams(Map<String, Object> entryMap, Type type) throws EndPointError {
        try {
            this.title = CEPUtils.requiredField(entryMap, "title", "Titulo");
            this.photoUrl = CEPUtils.notRequiredField(entryMap, "photoUrl");
            this.body = CEPUtils.requiredField(entryMap, "body", "Conteúdo");
            this.summary = CEPUtils.requiredField(entryMap, "summary", "Resumo");
            this.isPublic = CEPUtils.requiredField(entryMap, "isPublic", "Público");
            if (type == Type.UPDATE)
                CEPUtils.requiredField(entryMap, "id", "Id");
        } catch (EndPointError endPointError) {
            if (endPointError.getErrorReturn() == EndPointError.GlobalErrorReturn.FIELD_REQUIRED) {
                throw new EndPointError(ArticleService.Error.FIELD_REQUIRED, endPointError.getParameters());
            }
        }
    }


    public String getTitle() {
        return title;
    }

    public String getPhotoUrl() {
        return photoUrl;
    }

    public String getBody() {
        return body;
    }

    public String getSummary() {
        return summary;
    }

    public boolean isPublic() {
        return isPublic;
    }

    public Long getId() {
        return id;
    }

    public static enum Type {
        CREATE, UPDATE
    }
}
