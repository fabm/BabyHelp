package pt.core.cloudEndpoints;


import java.util.HashMap;
import java.util.Map;

public class CEError extends Exception {

    private CEErrorReturn ceErrorReturn;

    public String[] getParameters() {
        return parameters;
    }

    private String[] parameters;

    public CEError(CEErrorReturn ceErrorReturn, String... parameters) {
        super(String.format(ceErrorReturn.getMsg(), parameters));
        this.parameters = parameters;
        this.ceErrorReturn = ceErrorReturn;
    }

    public CEErrorReturn getCeErrorReturn() {
        return ceErrorReturn;
    }

    public Map<String, Object> getMap() {
        HashMap<String, Object> map = new HashMap<String, Object>();
        HashMap<String, Object> errorMap = new HashMap<String, Object>();
        map.put("message", this.getMessage());
        map.put("code", ceErrorReturn.getCode());
        map.put("context", ceErrorReturn.getContext());
        errorMap = new HashMap<String, Object>();
        errorMap.put("error", map);
        return errorMap;
    }



}
