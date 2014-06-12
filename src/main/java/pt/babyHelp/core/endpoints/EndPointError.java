package pt.babyHelp.core.endpoints;


import java.util.HashMap;
import java.util.Map;

public class EndPointError extends Exception {


    private ErrorReturn errorReturn;

    public EndPointError(ErrorReturn errorReturn,String...parameters) {
        super(String.format(errorReturn.getMsg(),parameters));
        this.errorReturn = errorReturn;
    }

    public Map<String, Object> getMap() {
        HashMap<String, Object> map = new HashMap<String, Object>();
        HashMap<String, Object> errorMap = new HashMap<String, Object>();
        map.put("message", this.getMessage());
        map.put("code", errorReturn.getCode());
        map.put("context", errorReturn.getContext());
        errorMap = new HashMap<String, Object>();
        errorMap.put("error", map);
        return errorMap;
    }

}
