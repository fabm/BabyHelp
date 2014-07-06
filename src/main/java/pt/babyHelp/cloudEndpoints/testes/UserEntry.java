package pt.babyHelp.cloudEndpoints.testes;

import pt.babyHelp.validation.BHValidationToRemove;
import pt.core.cloudEndpoints.parameter.evaluation.Evaluation;
import pt.core.cloudEndpoints.parameter.evaluation.ParameterEvaluated;

import java.util.List;

public class UserEntry implements ParameterEvaluated {
    @Evaluation(validations = {BHValidationToRemove.EMAIL})
    private String email;
    @Evaluation
    private List<String> roles;
    @Evaluation
    private boolean registered;
    @Evaluation
    private String name;
    @Evaluation(validations = BHValidationToRemove.REQUIRED)
    private boolean logged;
    @Evaluation
    private String profession;
    @Evaluation
    private boolean loadFromDS = false;
    private boolean eval;

    public void setEval(boolean eval) {
        this.eval = eval;
    }

    public boolean isLoadFromDS() {
        return loadFromDS;
    }

    public void setLoadFromDS(boolean loadFromDS) {
        this.loadFromDS = loadFromDS;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public boolean isRegistered() {
        return registered;
    }

    public void setRegistered(boolean registered) {
        this.registered = registered;
    }

    public boolean isLogged() {
        return logged;
    }

    public void setLogged(boolean logged) {
        this.logged = logged;
    }

    public String getProfession() {
        return profession;
    }

    public void setProfession(String profession) {
        this.profession = profession;
    }

    @Override
    public boolean isDefinitionRequest() {
        return eval;
    }
}