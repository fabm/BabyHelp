package pt.babyHelp.core.webComponents.inputs;

import java.util.ArrayList;
import java.util.Collection;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 24/12/13
 * Time: 08:09
 * To change this template use File | Settings | File Templates.
 */
public class InputDefault<T> implements Input<T>{
    private String name;
    private T value;
    private ArrayList<String> errorMessages;
    private String fieldLabel = null;
    private String idField = null;

    @Override
    public String getIdField() {
        return idField;
    }

    @Override
    public void setIdField(String idField) {
        this.idField = idField;
    }

    public void setFieldLabel(String fieldLabel) {
        this.fieldLabel = fieldLabel;
    }


    @Override
    public String getName() {
        return name;
    }

    @Override
    public void setName(String name) {
        this.name = name;
    }

    @Override
    public T getValue() {
        return value;
    }

    public void setValue(T value){
        this.value = value;
    }

    @Override
    public String getFieldLabel() {
        if(fieldLabel==null){
            return name;
        }
        return fieldLabel;
    }

    @Override
    public void addMessage(String msg) {
        getMsgCollection().add(msg);
    }

    @Override
    public Iterable<String> getMsgsIterator() {
        return getMsgCollection();
    }

    private Collection<String> getMsgCollection(){
        if(errorMessages==null){
            errorMessages = new ArrayList<String>();
        }
        return errorMessages;
    }

}
