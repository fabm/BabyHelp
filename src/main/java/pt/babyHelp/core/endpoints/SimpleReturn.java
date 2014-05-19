package pt.babyHelp.core.endpoints;

import java.util.HashMap;
import java.util.Map;

public class SimpleReturn implements EndPointReturn{

    private String key;
    private Object object;

    public SimpleReturn(Object object) {
        this.key = "return";
        this.object = object;
    }
    public SimpleReturn(String key,Object object) {
        this.key = key;
        this.object = object;
    }

    @Override
    public Map<String, Object> toMap() {
        HashMap<String,Object> returnMap = new HashMap<String, Object>();
        returnMap.put(key,object);
        return returnMap;
    }

    @Override
    public Type getType() {
        return Type.simple;
    }
}
