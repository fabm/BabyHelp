package pt.core.cloudEndpoints;

import pt.core.pojoMap.ToMap;

import java.lang.reflect.Field;
import java.util.*;

public class CEUtils {
    public static Map<String, Object> getMap(Object pojo) {
        Map<String, Object> map = new HashMap<String, Object>();
        Class<? extends Object> clazz = pojo.getClass();
        for (Field field : clazz.getDeclaredFields()) {
            ToMap toMapAnnotation = field.getAnnotation(ToMap.class);
            try {
                if (toMapAnnotation == null) break;
                field.setAccessible(true);
                Object value = field.get(pojo);
                if (toMapAnnotation.value().isEmpty()) {
                    map.put(field.getName(), value);
                } else if (toMapAnnotation.embeded()) {
                    map.put(toMapAnnotation.value(), CEUtils.getMap(value));
                } else {
                    map.put(toMapAnnotation.value(), value);
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return map;
    }

    public static <T> List<Map<String, Object>> listMapPojo(Iterable<T> iterable) {
        List<Map<String, Object>> mapsList = new ArrayList<Map<String, Object>>();
        for (T pojo : iterable) {
            mapsList.add(CEUtils.getMap(pojo));
        }
        return mapsList;
    }

    public static Map<String, Object> createMapAndPut(String key, Object value) {
        Map<String, Object> map = new HashMap<String, Object>();
        map.put(key, value);
        return map;
    }

    public static Map<String, Object> createMapAndPut(List<String> keys, List<Object> values) {
        if (keys.size() != values.size()) throw new RuntimeException("keys must be the same size of values");
        Map<String, Object> map = new HashMap<String, Object>();
        Iterator<String> itKeys = keys.iterator();
        Iterator<Object> itValues = values.iterator();
        while (itKeys.hasNext()){
            map.put(itKeys.next(),itValues.next());
        }
        return map;
    }


}
