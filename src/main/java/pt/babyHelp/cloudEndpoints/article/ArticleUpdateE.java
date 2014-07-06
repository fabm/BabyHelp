package pt.babyHelp.cloudEndpoints.article;

import pt.babyHelp.services.article.ArticleApiMap;
import pt.json.proccess.annotations.ApiMethodParameters;
import pt.json.proccess.validation.DefaultValidator;
import pt.json.proccess.validation.annotations.Required;

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
