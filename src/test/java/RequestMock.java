import javax.servlet.RequestDispatcher;
import javax.servlet.ServletInputStream;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.security.Principal;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 31/12/13
 * Time: 13:08
 * To change this template use File | Settings | File Templates.
 */
public class RequestMock implements HttpServletRequest {

    private HashMap<String, Object> attributesMap = new HashMap<String, Object>();
    private HashMap<String, String> parametersMap = new HashMap<String, String>();
    private HttpSession session = null;

    private UnsupportedOperationException itIsOnlyAMock() {
        return new UnsupportedOperationException(
                "This class it's only a mock and it doesn't implement this method");
    }

    @Override
    public Object getAttribute(String name) {
        return attributesMap.get(name);
    }

    @Override
    public Enumeration getAttributeNames() {
        final Iterator<String> iterator = attributesMap.keySet().iterator();
        return new Enumeration() {
            @Override
            public boolean hasMoreElements() {
                return iterator.hasNext();
            }

            @Override
            public Object nextElement() {
                return iterator.hasNext();
            }
        };
    }

    @Override
    public String getCharacterEncoding() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public void setCharacterEncoding(String env) throws UnsupportedEncodingException {
        itIsOnlyAMock();
    }

    @Override
    public int getContentLength() {
        itIsOnlyAMock();
        return 0;
    }

    @Override
    public String getContentType() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public ServletInputStream getInputStream() throws IOException {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getParameter(String name) {
        return parametersMap.get(name);
    }

    @Override
    public Enumeration getParameterNames() {
        final Iterator iterator = parametersMap.keySet().iterator();
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
    public String[] getParameterValues(String name) {
        String[] strings = new String[parametersMap.size()];
        parametersMap.values().toArray(strings);
        return strings;
    }

    @Override
    public Map getParameterMap() {
        return parametersMap;
    }

    @Override
    public String getProtocol() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getScheme() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getServerName() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public int getServerPort() {
        itIsOnlyAMock();
        return 0;
    }

    @Override
    public BufferedReader getReader() throws IOException {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getRemoteAddr() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getRemoteHost() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public void setAttribute(String name, Object o) {
        attributesMap.put(name, o);
    }

    @Override
    public void removeAttribute(String name) {
        attributesMap.remove(name);
    }

    @Override
    public Locale getLocale() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public Enumeration getLocales() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public boolean isSecure() {
        itIsOnlyAMock();
        return false;
    }

    @Override
    public RequestDispatcher getRequestDispatcher(String path) {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getRealPath(String path) {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public int getRemotePort() {
        itIsOnlyAMock();
        return 0;
    }

    @Override
    public String getLocalName() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getLocalAddr() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public int getLocalPort() {
        itIsOnlyAMock();
        return 0;
    }

    @Override
    public String getAuthType() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public Cookie[] getCookies() {
        itIsOnlyAMock();
        return new Cookie[0];
    }

    @Override
    public long getDateHeader(String name) {
        itIsOnlyAMock();
        return 0;
    }

    @Override
    public String getHeader(String name) {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public Enumeration getHeaders(String name) {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public Enumeration getHeaderNames() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public int getIntHeader(String name) {
        itIsOnlyAMock();
        return 0;
    }

    @Override
    public String getMethod() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getPathInfo() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getPathTranslated() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getContextPath() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getQueryString() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getRemoteUser() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public boolean isUserInRole(String role) {
        itIsOnlyAMock();
        return false;
    }

    @Override
    public Principal getUserPrincipal() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getRequestedSessionId() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getRequestURI() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public StringBuffer getRequestURL() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public String getServletPath() {
        itIsOnlyAMock();
        return null;
    }

    @Override
    public HttpSession getSession(boolean create) {
        if (create) session = new SessionMock();
        return session;
    }

    @Override
    public HttpSession getSession() {
        if (session == null)return getSession(true);
        return session;
    }

    @Override
    public boolean isRequestedSessionIdValid() {
        itIsOnlyAMock();
        return false;
    }

    @Override
    public boolean isRequestedSessionIdFromCookie() {
        itIsOnlyAMock();
        return false;
    }

    @Override
    public boolean isRequestedSessionIdFromURL() {
        itIsOnlyAMock();
        return false;
    }

    @Override
    public boolean isRequestedSessionIdFromUrl() {
        itIsOnlyAMock();
        return false;
    }
}
