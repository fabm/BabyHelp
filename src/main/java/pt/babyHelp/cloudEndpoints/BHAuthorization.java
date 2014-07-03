package pt.babyHelp.cloudEndpoints;

import com.google.api.server.spi.response.UnauthorizedException;
import com.google.appengine.api.users.User;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.testes.TestesCE;
import pt.babyHelp.cloudEndpoints.testes.UserEntry;
import pt.babyHelp.services.BabyHelp;
import pt.core.cloudEndpoints.Authorization;

import java.util.Arrays;
import java.util.ResourceBundle;

public class BHAuthorization extends Authorization {

    public BHAuthorization(User user) {
        super(user);
    }

    @Override
    protected void devMode() {
        if (TestesCE.userCurrent != null && !TestesCE.userCurrent.isLogged()) return;

        if (TestesCE.userCurrent == null) {
            ResourceBundle bundle = ResourceBundle.getBundle("user");
            String loggedParam = bundle.getString("logged");
            if (loggedParam == null || !loggedParam.equals("true")) return;
            TestesCE.userCurrent = new UserEntry();
            TestesCE.userCurrent.setLogged(true);
            TestesCE.userCurrent.setName(bundle.getString("name"));
            TestesCE.userCurrent.setEmail(bundle.getString("email"));
            TestesCE.userCurrent.setRegistered(bundle.getString("registered").equals("true"));
            TestesCE.userCurrent.setRoles(Arrays.asList(bundle.getString("roles").split(",")));
            TestesCE.userCurrent.setProfession(bundle.getString("profession"));
            TestesCE.userCurrent.setLoadFromDS(bundle.getString("loadFromDS").equals("true"));
        }
        if (TestesCE.userCurrent.isLoadFromDS()) {
            loadDataStore(TestesCE.userCurrent.getEmail());
        }

        if (userFromApp == null) {
            userFromApp = new UserFromApp();
            userFromApp.setName(TestesCE.userCurrent.getName());
            userFromApp.setEmail(TestesCE.userCurrent.getEmail());
            this.userRegistered = TestesCE.userCurrent.isRegistered();
            userFromApp.setProfession(TestesCE.userCurrent.getProfession());
            userFromApp.setRoles(Role.toRolesArray(TestesCE.userCurrent.getRoles()));
        }

    }
}
