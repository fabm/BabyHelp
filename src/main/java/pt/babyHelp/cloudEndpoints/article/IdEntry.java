package pt.babyHelp.cloudEndpoints.article;

import pt.gapiap.proccess.validation.annotations.Required;

public class IdEntry {
    @Required
    Long id;

    public IdEntry(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
