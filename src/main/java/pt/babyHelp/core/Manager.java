package pt.babyHelp.core;

import pt.babyHelp.bundle.BundleMap;
import pt.babyHelp.core.annotationsManager.BundledNames;
import pt.babyHelp.core.annotationsManager.PostCreation;
import pt.babyHelp.core.annotationsManager.Request;
import pt.babyHelp.core.annotationsManager.RequestType;
import pt.babyHelp.core.annotationsManager.interceptors.InterceptorAnnotation;
import pt.babyHelp.core.validators.Validator;
import pt.babyHelp.core.webComponents.inputs.Input;
import pt.babyHelp.core.webComponents.inputs.InputDefault;

import javax.servlet.http.HttpServletRequest;
import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.*;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 24/12/13
 * Time: 11:36
 * To change this template use File | Settings | File Templates.
 */
public abstract class Manager<T extends EventValidation> {

    protected boolean pageValid;
    private HttpServletRequest request;
    private T inputContainer;
    private BundleMap bundleMapName;
    private HashSet<String> dependenciesSet;
    private StringBuilder sbDependencies;
    private StringBuilder sbInsideJQuery = null;
    private Map<String, List<?>> idsLists;

    protected abstract void afterCatch();

    public abstract T createInputContainer();

    protected abstract void problemInReflectionsCall(Exception ex);

    public T getInputContainer() {
        return inputContainer;
    }

    public static boolean addErrorMessage(Input input, Validator validator){
        if(!validator.validate(input)){
            input.addMessage(validator.getMessage(input.getFieldLabel()));
            return false;
        }
        return true;
    }

    public void setRequest(HttpServletRequest request) {
        this.request = request;
        try {
            catchInputs();
            pageValid = inputContainer.isValid();
        } catch (Exception e) {
            problemInReflectionsCall(e);
        }
    }

    public void initSbInsideJQuery() {
        if (sbInsideJQuery == null) {
            sbInsideJQuery = new StringBuilder();
        }
    }

    public StringBuilder getSbInsideJQuery() {
        return sbInsideJQuery;
    }

    public void postRendering() {
        Object idsListsObject = request.getSession().getAttribute("iDslists");
        if (idsListsObject == null) {
            return;
        }
        Map idsListsMap = (Map) idsListsObject;
        if (idsListsObject instanceof Map) {
            request.getSession().removeAttribute("iDsLists");
        }
    }

    protected void initManager() {
        Object idsLists = request.getSession().getAttribute("iDslists");
        if (idsLists != null) {
            this.idsLists = (Map<String, List<?>>) idsLists;
        }
    }

    public void appendString(String str) {
        if(sbDependencies==null){
            sbDependencies = new StringBuilder();
        }
        sbDependencies.append(str);
    }

    public String getJavascriptSB() {
        return sbDependencies.toString();
    }

    public Set<String> getDependenciesSet(){
        if (dependenciesSet == null) {
            dependenciesSet = new HashSet<String>();
        }
        return dependenciesSet;
    }

    private void catchInputs() throws InvocationTargetException, IllegalAccessException, NoSuchMethodException, InstantiationException {
        inputContainer = createInputContainer();
        Class<?> icClass = inputContainer.getClass();
        for (Field f : icClass.getDeclaredFields()) {
            Request requestAnnotation = f.getAnnotation(Request.class);
            RequestType requestType = requestAnnotation == null ?
                    RequestType.REQUEST :
                    requestAnnotation.requestType();
            if (Input.class.isAssignableFrom(f.getType()) && requestType != RequestType.NONE) {
                String param = requestAnnotation == null || requestAnnotation.name().isEmpty() ?
                        f.getName() :
                        requestAnnotation.name();
                Input<? super Object> input = requestAnnotation == null ?
                        InputDefault.class.newInstance() : requestAnnotation.inputClass().newInstance();
                f.setAccessible(true);
                f.set(inputContainer, input);
                input.setName(param);

                BundledNames bn = inputContainer.getClass().getAnnotation(BundledNames.class);
                if (bn != null && bundleMapName == null) {
                    bundleMapName = new BundleMap(bn.value());
                }
                fieldNameSet(requestAnnotation, f, input);

                Object value = null;
                if (requestType == RequestType.REQUEST) {
                    input.setValue(request.getParameter(param));
                }
            }
        }
    }

    protected Map<String, List<?>> getIDsList() {
        if (idsLists == null) {
            idsLists = new HashMap<String, List<?>>();
            request.getSession().setAttribute("iDslists", idsLists);
        }
        return idsLists;
    }

    private void fieldNameSet(Request requestAnnotation, Field field, Input<?> input) {
        String fieldName = requestAnnotation != null &&
                !requestAnnotation.labelField().isEmpty() ?
                requestAnnotation.labelField() :
                null;
        if (fieldName != null) {
            input.setFieldLabel(fieldName);
        }
        if (bundleMapName != null) {
            try {
                fieldName = input.getFieldLabel();
                String bundleFieldName = bundleMapName.get(fieldName);
                input.setFieldLabel(bundleMapName.get(input.getFieldLabel()));
            } catch (MissingResourceException mre) {
            }
        }
    }

    private void callPostedCreation(Class<?> icClass) throws
            InvocationTargetException, IllegalAccessException {
        for (Method method : icClass.getDeclaredMethods()) {
            for (Annotation annotation : method.getDeclaredAnnotations()) {
                if (annotation.annotationType() == PostCreation.class) {
                    method.invoke(inputContainer, request);
                    return;
                }
            }
        }
    }

    private Collection<InterceptorContainer> getOrderedInterceptedAnnotationsCollection
            (Annotation[] declaredAnnotations) {
        ArrayList<InterceptorContainer> interceptorContainers = new ArrayList<InterceptorContainer>();
        for (Annotation annotation : declaredAnnotations) {
            try {
                interceptorContainers.add(new InterceptorContainer(annotation));
            } catch (IllegalArgumentException iae) {
            }
        }
        Collections.sort(interceptorContainers);
        return interceptorContainers;
    }

    private class InterceptorContainer implements Comparable<InterceptorContainer> {
        Annotation interceptionAnnotation;
        int priority = 0;

        private InterceptorContainer(Annotation interceptorAnnotation) {
            InterceptorAnnotation ia = interceptorAnnotation.annotationType().getAnnotation(InterceptorAnnotation.class);
            if (ia == null) {
                throw new IllegalArgumentException(interceptorAnnotation.getClass().getName() +
                        " don't have an InterceptorAnnotation");
            }
            this.priority = ia.priority();
            this.interceptionAnnotation = interceptorAnnotation;
        }

        @Override
        public int compareTo(InterceptorContainer ic) {
            if (this.priority > ic.priority) {
                return 1;
            }
            if (this.priority < ic.priority) {
                return -1;
            }
            return 0;
        }
    }



}
