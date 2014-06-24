package pt.babyHelp.services.photoToken;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import com.google.appengine.api.users.User;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.core.cloudEndpoints.Authorization;
import pt.core.cloudEndpoints.CEError;
import pt.core.cloudEndpoints.CEErrorReturn;
import pt.core.cloudEndpoints.CEUtils;
import pt.core.cloudEndpoints.services.CEService;

import java.util.Map;

public class PhotoTokenService implements CEService<PhotoTokenAM> {
    private Authorization authorization;
    private PhotoTokenAM action;

    public static CEService<PhotoTokenAM> create() {
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
    public CEService<PhotoTokenAM> execute(User user, PhotoTokenAM action, Object... args) throws UnauthorizedException {
        authorization = new BHAuthorization(user);
        authorization.check(action);
        this.action = action;
        return this;
    }

    @Override
    public Object getCEResponse() throws CEError {
        switch (action) {
            case GET:
                return getToken();
        }
        throw new UnsupportedOperationException(CEErrorReturn.NOT_IMPLEMENTED);
    }
}
