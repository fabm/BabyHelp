package globalTests;

import java.util.Objects;

public class PojoKey {
    private String key1;
    private String key2;

    public String getKey1() {
        return key1;
    }

    public void setKey1(String key1) {
        this.key1 = key1;
    }

    public String getKey2() {
        return key2;
    }

    public void setKey2(String key2) {
        this.key2 = key2;
    }

    @Override
    public int hashCode() {
        return Objects.hash(key1, key2);
    }

    @Override
    public boolean equals(Object obj) {
        if (obj == null || !obj.getClass().isAssignableFrom(PojoKey.class)) {
            return false;
        }
        PojoKey that = (PojoKey) obj;

        if (that.key1.equals(key1) && that.key2.equals(key2)) {
            return true;
        }
        return false;
    }
}
