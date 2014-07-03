package pt.core.servlets;

import com.google.api.client.auth.oauth2.BearerToken;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.http.*;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.server.spi.ObjectMapperUtil;
import com.google.api.server.spi.config.Named;
import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.blobstore.BlobKey;
import com.google.appengine.api.blobstore.BlobstoreService;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.User;
import com.google.appengine.repackaged.org.codehaus.jackson.JsonNode;
import com.google.appengine.repackaged.org.codehaus.jackson.map.ObjectMapper;
import pt.babyHelp.cloudEndpoints.UserAcessible;
import pt.core.cloudEndpoints.services.annotations.InstanceType;
import pt.core.cloudEndpoints.services.annotations.PhotoUploadClass;
import pt.core.cloudEndpoints.services.annotations.PhotoUploadMethod;
import pt.core.cloudEndpoints.services.annotations.PhotoUploadedKey;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.annotation.Annotation;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

public abstract class Upload extends HttpServlet {


    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();
    private static Map<String, UploadClassMethod> uploadMethodMap;

    static {
        uploadMethodMap = new TreeMap<String, UploadClassMethod>();
    }

    private BlobstoreService blobstoreService = BlobstoreServiceFactory.getBlobstoreService();

    public static <T extends UserAcessible> void registerUploadClass(Class<T> uploadClass) {
        PhotoUploadClass photoUploadClassAn = uploadClass.getAnnotation(PhotoUploadClass.class);
        if (uploadClass == null) {
            throw new RuntimeException("It's not possible to register a null class");
        }
        if (photoUploadClassAn == null) {
            String errorMessage = "Requires the annotation @PhotoUploadClass in '%s' class";
            errorMessage = String.format(errorMessage, uploadClass.getSimpleName());
            throw new RuntimeException(errorMessage);
        }


        UploadClassMethod uploadClassMethod = new UploadClassMethod();
        uploadClassMethod.clazz = uploadClass;
        uploadClassMethod.type = photoUploadClassAn.type();

        boolean hasMethods = false;
        for (Method method : uploadClass.getDeclaredMethods()) {
            PhotoUploadMethod photoUploadMethodAn = method.getAnnotation(PhotoUploadMethod.class);
            if (photoUploadMethodAn != null) {
                String key = photoUploadMethodAn.key();
                if (key == null) {
                    String errorMessage = "key of method '%s' must be a not null String";
                    errorMessage = String.format(errorMessage, method.getName());
                    throw new RuntimeException(errorMessage);
                }
                if (key.isEmpty()) {
                    String errorMessage = "key of method '%s' must be a not empty String";
                    errorMessage = String.format(errorMessage, method.getName());
                    throw new RuntimeException(errorMessage);
                }
                if (uploadMethodMap.containsKey(key)) {
                    String errorMessage = "The key '%s' already exists";
                    errorMessage = String.format(errorMessage, key);
                    throw new RuntimeException(errorMessage);
                }
                uploadMethodMap.put(key, uploadClassMethod);
                uploadClassMethod.methodsMap.put(key, method);
                hasMethods = true;
            }
        }
        if (!hasMethods) {
            String errorMessage = "the class '%s' don't has methods annotated with @PhotoUploadMethod";
            errorMessage = String.format(errorMessage, uploadClassMethod.clazz.getSimpleName());
            throw new RuntimeException(errorMessage);
        }

    }

    private static ObjectMapper addObjectMapper(HttpServletResponse res) {
        res.setContentType("application/json");
        return ObjectMapperUtil.createStandardObjectMapper();
    }

    /**
     * Call the url, that uses a OAuth2 to get the current email user
     *
     * @param accessToken String representation of the Bearer token
     * @return current user email
     * @throws java.io.IOException
     * @throws org.apache.http.client.HttpResponseException
     */
    public String getCurrentUserEmail(String accessToken)
            throws IOException, pt.core.cloudEndpoints.CEError, UnauthorizedException {
        if (accessToken == null) return null;
        GenericUrl userInfo = new GenericUrl("https://www.googleapis.com/userinfo/v2/me");
        Credential credential =
                new Credential(BearerToken.authorizationHeaderAccessMethod()).setAccessToken(accessToken);
        HttpRequestFactory requestFactory = HTTP_TRANSPORT.createRequestFactory(credential);

        HttpResponse httpResponse = null;
        try {
            httpResponse = requestFactory.buildGetRequest(userInfo).execute();
        } catch (HttpResponseException e) {
            if (e.getStatusCode() == 401) throw errorAuthorizationOauth();
        }
        ObjectMapper om = new ObjectMapper();
        JsonNode jsonNode = om.readTree(httpResponse.getContent());
        return jsonNode.get("email").toString();
    }

    private static Map<String, Object> errorMap(String message, int code) {
        Map<String, Object> mapError = new HashMap<String, Object>();
        mapError.put("code", code);
        mapError.put("message", message);
        return mapError;
    }

    protected abstract UnauthorizedException errorAuthorizationOauth();

    @Override
    public void doGet(HttpServletRequest req, HttpServletResponse res)
            throws ServletException, IOException {

        List<String> params = UrlParameters.getParameters(req);
        Map<String, Object> map = new HashMap<String, Object>();
        try {
            if (!params.isEmpty()) throw errorAuthorizationUpload();
            String token = params.get(0);
            try {
                map.put("email", getCurrentUserEmail(token));
            } catch (UnauthorizedException e) {
                throw new ServletException(e);
            }
        } catch (pt.core.cloudEndpoints.CEError CEError) {
            map.put("error", CEError.getMap());
        } catch (UnauthorizedException e) {
            throw new ServletException(e);
        }
        addObjectMapper(res);
        //getOld(res);
    }

    protected abstract UnauthorizedException errorAuthorizationUpload();

    private void getOld(HttpServletResponse res) throws IOException {
        ObjectMapper objectMaper = addObjectMapper(res);
        Map<String, Object> map = new HashMap<String, Object>();

        map.put("url", blobstoreService.createUploadUrl("/upload"));

        objectMaper.writeValue(res.getWriter(), map);
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {

        ObjectMapper objectMaper = addObjectMapper(res);


        Map<String, Object> map;
        String errorMessageReturnMap = "The method '%s' must return a Map<String,Object>";
        try {
            String action = req.getParameter("action");
            if (action == null || action.isEmpty()) throw new pt.core.cloudEndpoints.CEError(GlobalUploadError.NO_ACTION_PARAMETER);

            UploadClassMethod<? extends UserAcessible> uploadClassMethod = uploadMethodMap.get(action);
            if (uploadClassMethod == null) throw new pt.core.cloudEndpoints.CEError(GlobalUploadError.NO_UPLOAD_ACTION_REGISTERED, action);
            Method method = uploadClassMethod.methodsMap.get(action);

            errorMessageReturnMap = String.format(errorMessageReturnMap, method.getName());
            if (method.getReturnType() != Map.class) throw new RuntimeException(errorMessageReturnMap);

            Annotation[][] arr = method.getParameterAnnotations();
            Object[] parameterValues = new Object[arr.length];

            String errorMessage = "The method '%s' has parameters without @Named annotation";
            errorMessage = String.format(errorMessage, method.getName());

            boolean noNamedAnnotation = true;
            boolean noPhotoUploadedKey = true;
            for (int i = 0; i < arr.length; i++) {
                if (arr[i].length == 0) {
                    throw new RuntimeException(errorMessage);
                }
                for (Annotation annotation : arr[i]) {
                    if (annotation.annotationType() == Named.class) {
                        Named named = (Named) annotation;
                        parameterValues[i] = req.getParameter(named.value());
                        if (method.getParameterTypes()[i] == Long.class) {
                            parameterValues[i] = Long.parseLong(parameterValues[i].toString());
                        } else if (method.getParameterTypes()[i] == Integer.class) {
                            parameterValues[i] = Integer.parseInt(parameterValues[i].toString());
                        }
                        noNamedAnnotation = false;
                        break;
                    }
                    if (annotation.annotationType() == PhotoUploadedKey.class) {
                        if (method.getParameterTypes()[i] != String.class) {
                            throw new RuntimeException("the parameter with @PhotoUploadedKey must be a String");
                        }
                        noPhotoUploadedKey = false;
                        Map<String, List<BlobKey>> blobs = blobstoreService.getUploads(req);
                        List<BlobKey> mapFile = blobs.get("file");
                        parameterValues[i] = mapFile.get(0).getKeyString();
                    }
                }
            }
            if (noPhotoUploadedKey)
                throw new RuntimeException("There is no parameter annotated with @PhotoUploadedKey");

            if (noNamedAnnotation) {
                throw new RuntimeException(errorMessage);
            }

            String authorizationHeader = req.getHeader("Authorization");


            UserAcessible instance = uploadClassMethod.getInstace();
            User user = null;
            String email = getCurrentUserEmail(authorizationHeader);
            if (email != null)
                user = new User(getCurrentUserEmail(authorizationHeader), "");
            instance.setUser(user);
            try {
                map = (Map<String, Object>) method.invoke(instance, parameterValues);
            } catch (InvocationTargetException e) {
                Throwable target = e.getTargetException();
                if (target instanceof pt.core.cloudEndpoints.CEError) {
                    map = ((pt.core.cloudEndpoints.CEError) target).getMap();
                } else if (target instanceof UnauthorizedException)
                    throw (UnauthorizedException) target;
                else
                    throw new ServletException(e);
            }
        } catch (ClassCastException e) {
            throw new RuntimeException(errorMessageReturnMap);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        } catch (InstantiationException e) {
            throw new RuntimeException(e);
        } catch (UnauthorizedException e) {
            throw new ServletException(e);
        } catch (pt.core.cloudEndpoints.CEError CEError) {
            map = CEError.getMap();
        }

        objectMaper.writeValue(res.getWriter(), map);
    }


    private static class UploadClassMethod<T extends UserAcessible> {
        public Class<T> clazz;
        public InstanceType type;
        public Map<String, Method> methodsMap = new HashMap<String, Method>();
        private Object instance;

        public UserAcessible getInstace() throws IllegalAccessException, InstantiationException {
            if (this.type == InstanceType.NEW_INSTANCE) return clazz.newInstance();
            if (instance == null)
                instance = clazz.newInstance();
            return (UserAcessible) instance;
        }
    }
}
