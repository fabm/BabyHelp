package pt.core.cloudEndpoints.services;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.core.cloudEndpoints.CEReturn;

public interface CEService<A extends CEActionMap<?,?>> extends CEReturn{
    CEService<A> execute(User user,A action,Object...args) throws UnauthorizedException;
}
