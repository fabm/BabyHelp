package pt.core;

import com.google.api.server.spi.guice.GuiceSystemServiceServletModule;
import pt.babyHelp.cloudEndpoints.article.ArticleCE;
import pt.babyHelp.cloudEndpoints.article.ArticleCreationE;
import pt.babyHelp.cloudEndpoints.user.UserBHCE;
import pt.gapiap.servlets.ClientErrorsServlet;

import java.util.HashSet;
import java.util.Set;

public class BabyHelpServiceSystemModule extends GuiceSystemServiceServletModule {
  @Override
  protected void configureServlets() {
    super.configureServlets();
    Set<Class<?>> cloudEndpointsClasses = new HashSet<>();
    cloudEndpointsClasses.add(UserBHCE.class);
    cloudEndpointsClasses.add(ArticleCE.class);

    this.serve("/errors.json").with(new ClientErrorsServlet());
    this.serveGuiceSystemServiceServlet("/_ah/spi/*", cloudEndpointsClasses);
  }
}
