package pt.core;

import com.google.api.server.spi.ServletInitializationParameters;
import com.google.api.server.spi.guice.GuiceSystemServiceServletModule;
import com.google.inject.Scope;
import pt.babyHelp.cloudEndpoints.user.UserBHCE;

import java.lang.annotation.Annotation;
import java.util.HashSet;
import java.util.Set;

public class BabyHelpServiceSystemModule extends GuiceSystemServiceServletModule {
  @Override
  protected void configureServlets() {
    super.configureServlets();
    Set<Class<?>> cloudEndpointsClasses = new HashSet<>();
    cloudEndpointsClasses.add(UserBHCE.class);

    this.serveGuiceSystemServiceServlet("/_ah/spi/*",cloudEndpointsClasses);
  }

  @Override
  protected void serveGuiceSystemServiceServlet(String urlPattern, Iterable<? extends Class<?>> serviceClasses) {
    super.serveGuiceSystemServiceServlet(urlPattern, serviceClasses);
  }

  @Override
  protected void serveGuiceSystemServiceServlet(String urlPattern, ServletInitializationParameters initParameters) {
    super.serveGuiceSystemServiceServlet(urlPattern, initParameters);
  }

  @Override
  protected void bindScope(Class<? extends Annotation> scopeAnnotation, Scope scope) {
    super.bindScope(scopeAnnotation, scope);
  }


}
