package pt.babyHelp.cloudEndpoints.article;

import com.google.inject.name.Named;
import pt.babyHelp.services.article.ArticleApiMap;
import pt.gapiap.proccess.annotations.ApiMethodParameters;
import pt.gapiap.proccess.validation.defaultValidator.DefaultValidator;

import javax.validation.constraints.NotNull;

@ApiMethodParameters(
        api = ArticleApiMap.API,
        method = ArticleApiMap.UPDATE,
        validators = DefaultValidator.class
)

public class ArticleUpdateE extends ArticleCreationE {
    @NotNull
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
