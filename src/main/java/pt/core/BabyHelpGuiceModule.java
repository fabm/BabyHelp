package pt.core;

import pt.gapiap.cloud.endpoints.errors.ErrorManager;
import pt.gapiap.guice.GapiModule;

public class BabyHelpGuiceModule extends GapiModule {
  @Override
  protected void configure() {
    super.configure();
    bind(ErrorManager.class).toInstance(new BHErrorManager());
  }
}
