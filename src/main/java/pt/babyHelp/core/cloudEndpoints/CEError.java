package pt.babyHelp.core.cloudEndpoints;


import java.util.HashMap;
import java.util.Map;

public class CEError extends Exception {

    private CEErrorReturn CEErrorReturn;

    public String[] getParameters() {
        return parameters;
    }

    private String[] parameters;

    public CEError(CEErrorReturn ceErrorReturn, String... parameters) {
        super(String.format(ceErrorReturn.getMsg(), parameters));
        this.parameters = parameters;
        this.CEErrorReturn = ceErrorReturn;
    }

    public CEErrorReturn getCEErrorReturn() {
        return CEErrorReturn;
    }

    public Map<String, Object> getMap() {
        HashMap<String, Object> map = new HashMap<String, Object>();
        HashMap<String, Object> errorMap = new HashMap<String, Object>();
        map.put("message", this.getMessage());
        map.put("code", CEErrorReturn.getCode());
        map.put("context", CEErrorReturn.getContext());
        errorMap = new HashMap<String, Object>();
        errorMap.put("error", map);
        return errorMap;
    }


    public static enum GlobalCEErrorReturn implements CEErrorReturn {
        FIELD_REQUIRED(0, "The field %s is required");

        int code;
        String msg;

        GlobalCEErrorReturn(int code, String msg) {
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
