package pt.babyHelp.managers.removeManager;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 08/12/13
 * Time: 21:18
 * To change this template use File | Settings | File Templates.
 */
public class RemoveValidator {
    private boolean typeInvalid;
    private boolean idInvalid;
    private boolean idEmpty;
    private boolean typeEmpty;
    private boolean userFromAppDoesntExists;
    private boolean nextHealthTecDoesntExists;

    public boolean isAdmin() {
        return admin;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    private boolean admin;

    public RemoveValidator() {
        typeInvalid=false;
        idInvalid=false;
        idEmpty=false;
        typeEmpty=false;
    }

    public boolean isUserFromAppDoesntExists() {
        return userFromAppDoesntExists;
    }

    public void setUserFromAppDoesntExists(boolean userFromAppDoesntExists) {
        this.userFromAppDoesntExists = userFromAppDoesntExists;
    }

    public boolean isTypeInvalid() {
        return typeInvalid;
    }

    public void setTypeInvalid(boolean typeInvalid) {
        this.typeInvalid = typeInvalid;
    }

    public boolean isIdInvalid() {
        return idInvalid;
    }

    public void setIdInvalid(boolean idInvalid) {
        this.idInvalid = idInvalid;
    }

    public boolean isIdEmpty() {
        return idEmpty;
    }

    public void setIdEmpty(boolean idEmpty) {
        this.idEmpty = idEmpty;
    }

    public boolean isTypeEmpty() {
        return typeEmpty;
    }

    public void setTypeEmpty(boolean typeEmpty) {
        this.typeEmpty = typeEmpty;
    }

    public void setNextHealthTecDoesntExists(boolean nextHealthTecDoesntExists) {
        this.nextHealthTecDoesntExists = nextHealthTecDoesntExists;
    }

    public boolean isNextHealthTecDoesntExists() {
        return nextHealthTecDoesntExists;
    }
}
