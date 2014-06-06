package pt.babyHelp.servlets;

import pt.babyHelp.core.endpoints.EndPointError;

import java.util.Map;
import java.util.Set;

public interface UploadAction {
    void setContext(String string, String email);
    Map<String, Object> getReturn();
    Set<String> getParameters();
    void setValue(String key, Object value) throws EndPointError;
}
