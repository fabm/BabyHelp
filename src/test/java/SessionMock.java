import javax.servlet.ServletContext;
import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionContext;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 31/12/13
 * Time: 14:45
 * To change this template use File | Settings | File Templates.
 */
public class SessionMock implements HttpSession{
    private long time;
    private HashMap<String,Object> sessionMap = new HashMap<String, Object>();


    public SessionMock() {
        this.time = System.currentTimeMillis();
    }

    private UnsupportedOperationException itIsOnlyAMock(){
        return new UnsupportedOperationException(
                "This class it's only a mock and it doesn't implement this method");
    }

    @Override
    public long getCreationTime() {
        return time;
    }

    @Override
    public String getId() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public long getLastAccessedTime() {
        itIsOnlyAMock();
        return 0;
    }

    @Override
    public ServletContext getServletContext() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public void setMaxInactiveInterval(int interval) {
        itIsOnlyAMock();
    }

    @Override
    public int getMaxInactiveInterval() {
        itIsOnlyAMock();
        return 0;
    }

    @Override
    public HttpSessionContext getSessionContext() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public Object getAttribute(String name) {
        return sessionMap.get(name);
    }

    @Override
    public Object getValue(String name) {
        return sessionMap.get(name);
    }

    @Override
    public Enumeration getAttributeNames() {
        final Iterator<String> iterator = sessionMap.keySet().iterator();
        return new Enumeration() {
            @Override
            public boolean hasMoreElements() {
                return iterator.hasNext();
            }

            @Override
            public Object nextElement() {
                return iterator.next();
            }
        };
    }

    @Override
    public String[] getValueNames() {
        String[] names =  new String[sessionMap.size()];
        sessionMap.keySet().toArray(names);
        return names;
    }

    @Override
    public void setAttribute(String name, Object value) {
        sessionMap.put(name,value);
    }

    @Override
    public void putValue(String name, Object value) {
        sessionMap.put(name,value);
    }

    @Override
    public void removeAttribute(String name) {
        sessionMap.remove(name);
    }

    @Override
    public void removeValue(String name) {
        sessionMap.remove(name);
    }

    @Override
    public void invalidate() {
        itIsOnlyAMock();
    }

    @Override
    public boolean isNew() {
        itIsOnlyAMock();
        return false;
    }
}
