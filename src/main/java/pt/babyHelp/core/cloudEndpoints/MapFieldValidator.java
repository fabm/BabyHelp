package pt.babyHelp.core.cloudEndpoints;

import pt.babyHelp.core.validators.EmailChecker;

import java.util.Map;

public class MapFieldValidator {

    private static enum DefaultCEErrorErrorReturn implements CEErrorReturn {
        REQUIRED(0, "Field %s is required"), 
        INVALID_EMAIL(1, "The email field %s is inválid");

        DefaultCEErrorErrorReturn(int code, String msg) {
            this.code = code;
            this.msg = msg;
        }

        private int code;
        private String msg;

        @Override
        public String getContext() {
            return "mapFieldValidatorDefault";
        }

        @Override
        public int getCode() {
            return code;
        }

        @Override
        public String getMsg() {
            return msg;
        }
    }


    private CEErrorReturn ceErrorReturnRequired = DefaultCEErrorErrorReturn.REQUIRED;
    private CEErrorReturn ceErrorReturnEmailInvalid = DefaultCEErrorErrorReturn.INVALID_EMAIL;
    private Map<String, Object> map;

    public MapFieldValidator(Map<String, Object> map) {
        this.map = map;
    }

    public void setErrorReturnRequired(CEErrorReturn ceErrorReturnRequired) {
        this.ceErrorReturnRequired = ceErrorReturnRequired;
    }
    public void setErrorEmailInvalid(CEErrorReturn ceErrorReturnEmailInvalid) {
        this.ceErrorReturnEmailInvalid = ceErrorReturnEmailInvalid;
    }

    public <T> T require(String field, String alias) throws CEError {
        Object obj = map.get(field);
        if (obj == null) throw new CEError(ceErrorReturnRequired, alias);
        if (obj.getClass() == String.class && obj.toString().isEmpty())
            throw new CEError(ceErrorReturnRequired, alias);
        return (T) obj;
    }

    public String validEmail(String field, String alias) throws CEError {
        Object obj = map.get(field);
        if (obj == null) throw new CEError(ceErrorReturnRequired, alias);
        String str = (String)obj;

        if (obj.getClass() == String.class && obj.toString().isEmpty())
            throw new CEError(ceErrorReturnRequired, alias);

        if(!EmailChecker.check(str))
            throw new CEError(ceErrorReturnEmailInvalid, alias);

        return str;
    }


    public <T> T get(String field) {
        return (T) map.get(field);
    }
}
