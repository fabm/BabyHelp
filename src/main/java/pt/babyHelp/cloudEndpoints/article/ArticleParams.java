package pt.babyHelp.cloudEndpoints.article;

import pt.babyHelp.services.BabyHelp;
import pt.core.cloudEndpoints.MapFieldValidator;

import java.util.Map;

public class ArticleParams {
    private String title;
    private String photoUrl;
    private String body;
    private String summary;
    private boolean isPublic;
    private Long id;

    public ArticleParams(Map<String, Object> entryMap, Type type) throws pt.core.cloudEndpoints.CEError {
        MapFieldValidator mapFV = new MapFieldValidator(entryMap);
        mapFV.setErrorReturnRequired(BabyHelp.CEError.REQUIRED_FIELD);
        this.title = mapFV.require("title", "Titulo");
        this.photoUrl = mapFV.get("photoUrl");
        this.body = mapFV.require("body", "Conteúdo");
        this.summary = mapFV.require("summary", "Resumo");
        this.isPublic = mapFV.require("isPublic", "Público");
        if (type == Type.UPDATE)
            mapFV.require("id", "Id");
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
