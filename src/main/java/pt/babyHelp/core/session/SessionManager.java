package pt.babyHelp.core.session;

import pt.babyHelp.bd.PersistenceException;
import pt.babyHelp.bd.SessionEntity;

import java.util.Calendar;

public class SessionManager<T extends SessionContainer<?>> {

    private T sessionContainer;
    private SessionEntity sessionEntity;
    private int sessionCounter;

    public SessionManager(T sessionContainer) {
        this.sessionCounter = 0;
        this.sessionEntity = new SessionEntity();
        this.sessionContainer = sessionContainer;
    }

    public int createSession(){
        return ++sessionCounter;
    }

    public int getSessionCounter() {
        return sessionCounter;
    }

    public T getSessionContainer() {
        return sessionContainer;
    }

    public SessionEntity getSessionEntity() {
        return sessionEntity;
    }

    public boolean logSession() throws PersistenceException {
        Calendar fifteenMinutesAgo = Calendar.getInstance();
        fifteenMinutesAgo.add(Calendar.MINUTE, -15);

        if (sessionEntity.getLastTime().before(fifteenMinutesAgo)) {
            sessionEntity.save();
            return true;
        }

        return false;
    }
}
