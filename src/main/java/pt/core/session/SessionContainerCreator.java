package pt.core.session;

public interface SessionContainerCreator<T extends SessionContainer<?>> {
    T newSessionContainer();
}
