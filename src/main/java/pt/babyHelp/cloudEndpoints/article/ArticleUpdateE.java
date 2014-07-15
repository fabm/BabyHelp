package pt.babyHelp.cloudEndpoints.article;

import pt.babyHelp.services.article.ArticleApiMap;
import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.DefaultValidator;
import pt.gapiap.proccess.validation.annotations.Required;

@ApiMethodParameters(
        api = ArticleApiMap.API,
        method = ArticleApiMap.UPDATE,
        validator = DefaultValidator.class
)

public class ArticleUpdateE extends ArticleCreationE {
    @Required
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
