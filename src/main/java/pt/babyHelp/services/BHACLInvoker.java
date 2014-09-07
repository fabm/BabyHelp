package pt.babyHelp.services;

import pt.babyHelp.cloudEndpoints.BHAuthorization;
import pt.gapiap.cloud.endpoints.authorization.ACLInvoker;

public class BHACLInvoker<T> extends ACLInvoker<T,BHAuthorization> {
  public BHACLInvoker(Class<T> sint) {
    super(sint);
  }
}
