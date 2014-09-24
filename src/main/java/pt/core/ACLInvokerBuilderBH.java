package pt.core;

import com.google.appengine.api.users.User;
import com.google.inject.Inject;
import com.google.inject.Injector;
import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.babyHelp.services.BHACLInvoker;
import pt.babyHelp.services.RolesCapturerBH;
import pt.gapiap.cloud.endpoints.authorization.AuthorizationContext;
import pt.gapiap.cloud.endpoints.authorization.AuthorizationContextImpl;

public class ACLInvokerBuilderBH<T> {
  private User user;
  private T service;
  private Class<T> serviceClass;
  @Inject
  private Injector injector;

  public ACLInvokerBuilderBH<T> setUser(User user) {
    this.user = user;
    return this;
  }

  public ACLInvokerBuilderBH<T> setService(T service) {
    this.service = service;
    return this;
  }

  public ACLInvokerBuilderBH<T> setServiceClass(Class<T> serviceClass) {
    this.serviceClass = serviceClass;
    return this;
  }

  public BHACLInvoker<T> build() {
    BHAuthorization bhAuthorization = new BHAuthorization();
    AuthorizationContext<T, BHAuthorization> authorizationContext;
    authorizationContext = new AuthorizationContextImpl<>(bhAuthorization, service);
    BHACLInvoker<T> aclInvoker = new BHACLInvoker<>(serviceClass);
    injector.injectMembers(aclInvoker);
    aclInvoker.init(authorizationContext, new RolesCapturerBH(), user);
    return aclInvoker;
  }
}
