package pt.babyHelp.services.photoToken;

import com.google.appengine.api.blobstore.BlobstoreServiceFactory;
import pt.gapiap.proccess.annotations.MappedAction;

import java.util.Map;

import static com.google.appengine.repackaged.com.google.common.collect.ImmutableMap.of;

public class PhotoTokenService {

    @MappedAction(value = PhotoTokenApiMap.GET,area = "photo-token")
    private Map<String, ? extends Object> getToken() {
        return of("result",
                of("token",
                        BlobstoreServiceFactory.getBlobstoreService().createUploadUrl("/upload")
                )
        );
    }

}
