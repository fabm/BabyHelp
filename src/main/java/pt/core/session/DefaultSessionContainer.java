package pt.core.session;

import java.util.HashMap;
import java.util.Map;

public class DefaultSessionContainer implements SessionContainer<String>{
    protected Map<String,Object> map = new HashMap<String, Object>();

    public <V>void put(String key,V value){
        map.put(key,value);
    }
    @Override
    public <V> V getValue(String key) {
        return (V) map.get(key);
    }
}
