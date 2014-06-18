package pt.core.session;

public interface SessionContainer<K> {
    <V> V getValue(K key);
}
