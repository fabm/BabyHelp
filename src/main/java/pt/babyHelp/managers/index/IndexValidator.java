package pt.babyHelp.managers.index;
/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 30/11/13
 * Time: 23:08
 * To change this template use File | Settings | File Templates.
 */
public class IndexValidator {
    private boolean itNextHealthTecHasRows;
    private boolean itUserFromAppHasRows;
    private boolean mailEmpty;
    private boolean mailMalformed;
    private boolean mailAlreadyExists;
    private boolean formHealthTec;
    private boolean admin;

    public IndexValidator() {
        itNextHealthTecHasRows = false;
        itUserFromAppHasRows = false;
        mailAlreadyExists = false;
        mailMalformed = false;
        mailAlreadyExists = false;
        formHealthTec = false;
        admin = false;
    }

    public boolean isReflectionProblem() {
        return reflectionProblem;
    }

    public void setReflectionProblem(boolean reflectionProblem) {
        this.reflectionProblem = reflectionProblem;
    }

    private boolean reflectionProblem;

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean isItNextHealthTecHasRows() {
        return itNextHealthTecHasRows;
    }

    public void setItNextHealthTecHasRows(boolean itNextHealthTecHasRows) {
        this.itNextHealthTecHasRows = itNextHealthTecHasRows;
    }

    public boolean isItUserFromAppHasRows() {
        return itUserFromAppHasRows;
    }

    public void setItUserFromAppHasRows(boolean itUserFromAppHasRows) {
        this.itUserFromAppHasRows = itUserFromAppHasRows;
    }

    public boolean isMailAlreadyExists() {
        return mailAlreadyExists;
    }

    public void setMailAlreadyExists(boolean mailAlreadyExists) {
        this.mailAlreadyExists = mailAlreadyExists;
    }

    public boolean isFormHealthTec() {
        return formHealthTec;
    }

    public void setFormHealthTec(boolean formHealthTec) {
        this.formHealthTec = formHealthTec;
    }

    public boolean isMailEmpty() {
        return mailEmpty;
    }

    public void setMailEmpty(boolean mailEmpty) {
        this.mailEmpty = mailEmpty;
    }

    public boolean isMailMalformed() {
        return mailMalformed;
    }

    public void setMailMalformed(boolean mailMalformed) {
        this.mailMalformed = mailMalformed;
    }
}