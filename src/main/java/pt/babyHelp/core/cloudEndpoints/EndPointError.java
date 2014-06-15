package pt.babyHelp.core.cloudEndpoints;


import java.util.HashMap;
import java.util.Map;

public class EndPointError extends Exception {

    private ErrorReturn errorReturn;

    public String[] getParameters() {
        return parameters;
    }

    private String[] parameters;

    public EndPointError(ErrorReturn errorReturn, String... parameters) {
        super(String.format(errorReturn.getMsg(), parameters));
        this.parameters = parameters;
        this.errorReturn = errorReturn;
    }

    public ErrorReturn getErrorReturn() {
        return errorReturn;
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


    public static enum GlobalErrorReturn implements ErrorReturn {
        FIELD_REQUIRED(0, "The field %s is required");

        int code;
        String msg;

        GlobalErrorReturn(int code, String msg) {
            this.code = code;
            this.msg = msg;
        }

        @Override
        public String getContext() {
            return "global";
        }

        @Override
        public int getCode() {
            return this.code;
        }

        @Override
        public String getMsg() {
            return this.msg;
        }
    }

}
