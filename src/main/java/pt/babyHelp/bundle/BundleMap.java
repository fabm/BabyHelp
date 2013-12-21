package pt.babyHelp.bundle;

import pt.babyHelp.utils.CharsetConverter;

import java.io.UnsupportedEncodingException;
import java.util.*;

public class BundleMap implements Map<String,String> {

    private ResourceBundle bundle;

    public BundleMap(String bundleFile) {
        this.bundle = ResourceBundle.getBundle("bundle."+bundleFile, Locale.getDefault());
    }

    @Override
    public int size() {
        throw new UnsupportedOperationException();
    }

    @Override
    public boolean isEmpty() {
        throw new UnsupportedOperationException();
    }

    @Override
    public boolean containsKey(Object key) {
        throw new UnsupportedOperationException();
    }

    @Override
    public boolean containsValue(Object value) {
        throw new UnsupportedOperationException();
    }

    @Override
    public String put(String key, String value) {
        throw new UnsupportedOperationException();
    }

    @Override
    public String remove(Object key) {
        throw new UnsupportedOperationException();
    }


    @Override
    public void putAll(Map m) {
        throw new UnsupportedOperationException();
    }

    @Override
    public void clear() {
        throw new UnsupportedOperationException();
    }

    @Override
    public Set keySet() {
        throw new UnsupportedOperationException();
    }

    @Override
    public Collection values() {
        throw new UnsupportedOperationException();
    }

    @Override
    public Set<Entry<String, String>> entrySet() {
        throw new UnsupportedOperationException();
    }
    @Override
    public String get(Object key) {
        String ret = bundle.getString((String) key);
        try {
            return CharsetConverter.latin1ToUTF8(ret);
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Error when try to get a bundle string ("+e.getMessage()+")");
        }
    }


}
