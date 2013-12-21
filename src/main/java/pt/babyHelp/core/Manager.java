package pt.babyHelp.core;

import pt.babyHelp.core.annotationsManager.Request;
import pt.babyHelp.core.annotationsManager.Session;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpSession;
import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 29/11/13
 * Time: 21:55
 * To change this template use File | Settings | File Templates.
 */
public abstract class Manager<T> {
    protected HttpSession session;
    protected ServletRequest request;
    protected HashMap<String, Method> renderPanelsMethods;
    private boolean withRequests;
    protected T inputs;
    private boolean validatesIfHasRequests = true;
    protected boolean pageValid = false;
    private Map<String,List<?>>idsLists = null;

    public Manager() {
        renderPanelsMethods = null;
        withRequests = false;
        inputs = getNewIputsInstance();
    }

    protected abstract T getNewIputsInstance();
    protected abstract void problemInReflectionsCall(Exception ex);
    public abstract boolean pageValidatation();
    public abstract void afterValidatation();


    public void setContext(ServletRequest request, HttpSession session) {
        this.session = session;
        this.request = request;
        initManager();
    }

    private void initManager(){
        Object idsLists = session.getAttribute("iDslists");
        if(idsLists!=null){
            this.idsLists= (Map<String, List<?>>) idsLists;
        }
        catchRequestAndSession();
        if(validatesIfHasRequests && hasRequests()){
            pageValid = pageValidatation();
        }
        afterValidatation();
    }

    protected Map<String,List<?>> getIDsList(){
        if(idsLists==null){
            idsLists = new HashMap<String, List<?>>();
            session.setAttribute("iDslists",idsLists);
        }
        return idsLists;
    }

    public void postRendering(){
        Object idsListsObject = session.getAttribute("iDslists");
        if(idsListsObject == null){
            return;
        }
        Map idsListsMap = (Map)idsListsObject;
        if(idsListsObject instanceof Map){
           session.removeAttribute("iDsLists");
        }
    }

    public boolean isPageValid(){
        return pageValid;
    }

    protected boolean hasRequests() {
        return withRequests;
    }

    private void catchRequestAndSession() {
        Method[] methods = inputs.getClass().getDeclaredMethods();
        for (Method method : methods) {
            Annotation[] anotations = method.getDeclaredAnnotations();
            String methodName = method.getName();
            boolean withAnnotations = false;
            for (Annotation annotation : anotations) {
                withAnnotations = true;
                if (annotation instanceof Request) {
                    if (methodName.startsWith("set")) {
                        String parName = ((Request) annotation).name();
                        if (parName.isEmpty()) {
                            parName = ReflectionNamesManager.nameFromAcessor(method.getName());
                        }

                        setterRequest(method, parName);
                    }
                }
                if (annotation instanceof Session) {
                    if (methodName.startsWith("set")) {
                        setterSession(method, (Session) annotation);
                    }
                }
            }
            if(!withAnnotations){
                if (methodName.startsWith("set")) {
                    setterRequest(method, ReflectionNamesManager.nameFromAcessor(method.getName()));
                }
            }
        }
    }


    private void setterSession(Method method, Session annotation) {
        String parName = annotation.name();
        if (parName.isEmpty()) {
            parName = ReflectionNamesManager.nameFromAcessor(method.getName());
        }
        try {
            method.invoke(inputs,
                    this.session.getAttribute(parName)
            );
        } catch (Exception e) {
            problemInReflectionsCall(e);
        }
    }

    private void getterSession(Method method, Session annotation) {
        try {
            String parName = annotation.name();
            if (parName.isEmpty()) {
                parName = ReflectionNamesManager.nameFromAcessor(method.getName());
            }
            this.session.setAttribute(parName, method.invoke(inputs));
        } catch (Exception e) {
            problemInReflectionsCall(e);
        }
    }

    private void setterRequest(Method method, String parName) {
        try {
            String requestValue = this.request.getParameter(parName);
            withRequests = withRequests || requestValue != null;
            method.invoke(inputs, requestValue);
        } catch (Exception e) {
            problemInReflectionsCall(e);
        }
    }
}
