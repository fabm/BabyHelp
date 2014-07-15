package pt.core.cloudEndpoints.services;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.gapiap.cloud.endpoints.CEReturn;

public interface CEService extends CEReturn {
    CEService execute(User user,String action,Object entry) throws UnauthorizedException;
    CEService execute(User user,String action) throws UnauthorizedException;
}
