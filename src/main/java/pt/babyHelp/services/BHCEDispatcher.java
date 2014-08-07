package pt.babyHelp.services;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.gapiap.cloud.endpoints.Authorization;
import pt.gapiap.cloud.endpoints.CEError;
import pt.gapiap.cloud.endpoints.CEReturn;
import pt.gapiap.services.CEDispatcher;
import pt.gapiap.services.Dispatcher;

public class BHCEDispatcher implements CEReturn{
    private CEDispatcher<Role> ceDispatcher;

    public BHCEDispatcher(Dispatcher<Role> dispatcher) {
        ceDispatcher = new CEDispatcher<>(dispatcher);
    }

    public BHCEDispatcher setEntry(Object entry) {
        ceDispatcher.setEntry(entry);
        return this;
    }

    public BHCEDispatcher setMethodName(String methodName) {
        ceDispatcher.setMethodName(methodName);
        return this;
    }

    public BHCEDispatcher setUser(User user) {
        ceDispatcher.setAuthorization(new BHAuthorization(user));
        return this;
    }

    public Object getCEResponse() throws CEError, UnauthorizedException {
        return ceDispatcher.getCEResponse();
    }
}
