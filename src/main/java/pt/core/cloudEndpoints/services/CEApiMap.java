package pt.core.cloudEndpoints.services;

public interface CEApiMap<T extends Enum<T>> {
    T[] getRoles();
    String getMethod();
    boolean autenticationRequired();
    String getArea();
}
