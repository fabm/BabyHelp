package pt.babyHelp.cloudEndpoints.article;

import com.annotation.processor.validation.Required;

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
