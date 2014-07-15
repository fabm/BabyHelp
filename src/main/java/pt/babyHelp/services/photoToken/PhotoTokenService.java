package pt.babyHelp.services.photoToken;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.User;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.core.cloudEndpoints.Authorization;
import pt.core.cloudEndpoints.CEUtils;
import pt.core.cloudEndpoints.services.CEService;
import pt.gapiap.cloud.endpoints.CEError;
import pt.gapiap.cloud.endpoints.CEErrorReturn;

import java.util.Map;

public class PhotoTokenService implements CEService {
    private Authorization authorization;
    private String method;

    public static CEService create() {
        return new PhotoTokenService();
    }

    private Map<String, Object> getToken() {
        return CEUtils.createMapAndPut("result",
                CEUtils.createMapAndPut(
                        "token",
                        BlobstoreServiceFactory.getBlobstoreService().createUploadUrl("/upload")
                )
        );
    }

    @Override
    public CEService execute(User user, String method, Object args) throws UnauthorizedException {
        authorization = new BHAuthorization(user);
        authorization.check(method);
        this.method = method;
        return this;
    }

    @Override
    public CEService execute(User user, String method) throws UnauthorizedException {
        return execute(user, method,null);
    }

    @Override
    public Object getCEResponse() throws CEError {
        switch (method) {
            case PhotoTokenApiMap.GET:
                return getToken();
        }
        throw new UnsupportedOperationException(CEErrorReturn.NOT_IMPLEMENTED);
    }
}
