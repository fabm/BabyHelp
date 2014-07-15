package pt.babyHelp.cloudEndpoints.article;


import pt.gapiap.proccess.validation.annotations.Required;

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
