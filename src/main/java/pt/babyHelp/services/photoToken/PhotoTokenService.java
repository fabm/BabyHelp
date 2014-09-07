package pt.babyHelp.services.photoToken;

import pt.gapiap.proccess.annotations.MappedAction;

import java.util.Map;

/**
 * Created by francisco on 02/09/14.
 */
public interface PhotoTokenService {
    @MappedAction(value = PhotoTokenApiMap.GET,area = "photo-token")
    Map<String, ? extends Object> getToken();
}
