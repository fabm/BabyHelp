package pt.babyHelp.managers.removeManager;

import pt.babyHelp.core.annotationsManager.Request;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 08/12/13
 * Time: 21:18
 * To change this template use File | Settings | File Templates.
 */
public class RemoveInputs {
    private String id;
    private String type;

    public String getId() {
        return id;
    }

    @Request
    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }
    @Request
    public void setType(String type) {
        this.type = type;
    }
}
