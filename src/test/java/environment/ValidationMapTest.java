package environment;

import com.google.inject.Guice;
import com.google.inject.Injector;
import org.junit.Test;
import pt.gapiap.cloud.maps.ApiMapper;
import pt.gapiap.proccess.logger.Logger;

public class ValidationMapTest {
    @Test
    public void validationMap() {
        Injector injector = Guice.createInjector(new AProcessorInjection());
        ApiMapper apiMapper = injector.getInstance(ApiMapper.class);
        apiMapper.init();
        injector.getInstance(Logger.class).getPrintWriter().flush();
    }
}
