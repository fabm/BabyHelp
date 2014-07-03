package pt.babyHelp.cloudEndpoints.article;

import com.annotation.processor.validation.Required;

public class IdArticleE {
    @Required
    private Long id;

    public IdArticleE(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
