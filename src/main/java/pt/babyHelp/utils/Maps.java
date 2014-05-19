package pt.babyHelp.utils;

import java.util.HashMap;
import java.util.Map;

public class Maps {
    public static <T>Map<String,T> asMap(String key, T value){
        HashMap<String,T> map = new HashMap<String, T>();
        map.put(key,value);
        return map;
    }
}
