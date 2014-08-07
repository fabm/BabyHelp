package environment;

import com.google.inject.AbstractModule;
import pt.babyHelp.cloudEndpoints.article.ArticleCreationE;
import pt.babyHelp.cloudEndpoints.article.ArticleUpdateE;
import pt.babyHelp.cloudEndpoints.user.parameters.UpdateRolesP;
import pt.babyHelp.cloudEndpoints.user.parameters.UpdateUserNameP;
import pt.gapiap.convert.RoundEnvironmentCAB;
import pt.gapiap.proccess.logger.Logger;

import javax.annotation.processing.RoundEnvironment;
import java.io.PrintWriter;
import java.util.Arrays;

public class AProcessorInjection extends AbstractModule {
    @Override
    protected void configure() {
        bind(RoundEnvironment.class).toInstance(new RoundEnvironmentCAB(
                Arrays.asList(
                        UpdateRolesP.class,
                        UpdateUserNameP.class,
                        ArticleCreationE.class,
                        ArticleUpdateE.class
                )
        ));
        bind(Logger.class).toInstance(new Logger(new PrintWriter(System.out)));
    }
}
