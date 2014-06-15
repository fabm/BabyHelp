package pt.babyHelp.utils;

import com.google.common.collect.*;

import java.util.HashMap;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 04/03/14
 * Time: 14:42
 * To change this template use File | Settings | File Templates.
 */
public class MapUtils {
    public static <K1,K2,V>Map<K1,V> getCorrenspondenceValueKey(Map<K1,K2> map1,Map<K2,V> map2){
        if(map1.size() != map2.size()) throw new IllegalArgumentException("size differents");
        Map<K1,V> map = new HashMap<K1, V>(map1.size());
        for(Map.Entry<K1,K2> me1:map1.entrySet()){
            map.put(
                    me1.getKey(),
                    map2.get(me1.getValue()));
        }
        return map;
    }




}
