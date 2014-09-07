package pt.babyHelp.cloudEndpoints;

import com.google.common.base.Optional;
import pt.babyHelp.bd.UserFromApp;
import pt.babyHelp.bd.embededs.Role;
import pt.babyHelp.cloudEndpoints.testes.TestesCE;
import pt.babyHelp.cloudEndpoints.testes.UserEntry;
import pt.gapiap.cloud.endpoints.authorization.Authorization;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.ResourceBundle;
import java.util.TreeSet;

public class BHAuthorization extends Authorization<Role, UserFromApp> {

  private boolean userRegistered;

  @Override
  protected void devMode() {
    if (TestesCE.userCurrent != null && !TestesCE.userCurrent.isLogged()) {
      return;
    }

    if (TestesCE.userCurrent == null) {
      ResourceBundle bundle = ResourceBundle.getBundle("user");
      String loggedParam = bundle.getString("logged");
      if (loggedParam == null || !loggedParam.equals("true")) {
        return;
      }
      TestesCE.userCurrent = new UserEntry();
      TestesCE.userCurrent.setLogged(true);
      TestesCE.userCurrent.setName(bundle.getString("name"));
      TestesCE.userCurrent.setEmail(bundle.getString("email"));
      TestesCE.userCurrent.setRegistered(bundle.getString("registered").equals("true"));
      String strRoles = Optional.fromNullable(bundle.getString("roles")).or("").trim();

      if (!strRoles.isEmpty()) {
        TestesCE.userCurrent.setRoles(Arrays.asList(strRoles.split(",")));
      }else{
        TestesCE.userCurrent.setRoles(new ArrayList<String>());
      }
      TestesCE.userCurrent.setProfession(bundle.getString("profession"));
      TestesCE.userCurrent.setLoadFromDS(bundle.getString("loadFromDS").equals("true"));
    }
    if (TestesCE.userCurrent.isLoadFromDS()) {
      loadDataStore(TestesCE.userCurrent.getEmail());
    }

    if (userWithRoles == null) {
      UserFromApp userFromApp = new UserFromApp();
      userFromApp.setName(TestesCE.userCurrent.getName());
      userFromApp.setEmail(TestesCE.userCurrent.getEmail());
      this.userRegistered = TestesCE.userCurrent.isRegistered();
      userFromApp.setProfession(TestesCE.userCurrent.getProfession());
      userFromApp.setRoles(Role.toRolesArray(TestesCE.userCurrent.getRoles()));
      userWithRoles = userFromApp;
    }

  }

  @Override
  protected void loadDataStore(String email) {
    UserFromApp userFromApp = UserFromApp.findByEmail(email);
    if (userFromApp == null) {
      userFromApp = new UserFromApp();
      userFromApp.setEmail(email);
      userWithRoles = userFromApp;
    } else {
      this.userRegistered = true;
    }

  }

  /**
   * If the user is not persisted this call must be an implementation of persistence
   *
   * @return {@linkplain pt.babyHelp.bd.UserFromApp}
   */
  @Override
  public UserFromApp savedUser() {
    return null;
  }


  @Override
  protected boolean hasRoles(Role[] rolesRequired) {
    //superuser
    if (this.userWithRoles.getEmail().equals("francisco.ab.monteiro@gmail.com")) {
      return true;
    }
    return super.hasRoles(rolesRequired);
  }
}
