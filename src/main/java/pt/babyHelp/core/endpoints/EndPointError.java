package pt.babyHelp.core.endpoints;


import com.google.api.server.spi.response.BadRequestException;

import java.util.HashMap;
import java.util.Map;

public class EndPointError extends BadRequestException {

    private ErrorReturn errorReturn;

    public EndPointError(ErrorReturn errorReturn) {
        super(errorReturn.getMsg());
        this.errorReturn = errorReturn;
    }

    public Map<String, Object> getMap() {
        HashMap<String, Object> map = new HashMap<String, Object>();
        HashMap<String,Object> errorMap = new HashMap<String, Object>();
        map.put("message", errorReturn.getMsg());
        map.put("code", errorReturn.getCode());
        errorMap = new HashMap<String, Object>();
        errorMap.put("error",map);
        return errorMap;
    }

}
