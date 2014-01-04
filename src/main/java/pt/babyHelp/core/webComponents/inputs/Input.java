package pt.babyHelp.core.webComponents.inputs;

import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 24/12/13
 * Time: 08:46
 * To change this template use File | Settings | File Templates.
 */
public interface Input<T> {
    String getName();
    void setName(String name);
    T getValue();
    void setValue(T value);
    String getFieldLabel();
    void setFieldLabel(String fieldLabel);
    void addMessage(String msg);
    Iterable<String> getMsgsIterator();
    String getIdField();
    void setIdField(String idField);
}
