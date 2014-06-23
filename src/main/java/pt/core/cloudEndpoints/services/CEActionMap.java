package pt.core.cloudEndpoints.services;

public interface CEActionMap<T extends Enum<T>,A extends Enum<A>> {
    T[] getRoles();
    A getAction();
    boolean autenticationRequired();
}
