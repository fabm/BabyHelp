package pt.babyHelp.cloudEndpoints.article;


import javax.validation.constraints.NotNull;

public class IdEntry {
    @NotNull
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
