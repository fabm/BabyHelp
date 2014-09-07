package pt.babyHelp.cloudEndpoints.article;

import javax.validation.constraints.NotNull;

public class IdArticleE {
    @NotNull
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
