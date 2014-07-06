package environment;

import com.google.appengine.tools.development.testing.*;
import org.junit.rules.ExternalResource;

public class Environment extends ExternalResource {
    private LocalServiceTestHelper helper;
    private boolean isAdmin = false;

    public Environment(boolean isAdmin) {
        this.isAdmin = isAdmin;
    }
    public Environment() {
        this.isAdmin = isAdmin;
    }

    @Override
    protected void before() throws Throwable {
        helper = new LocalServiceTestHelper(new LocalDatastoreServiceTestConfig(),
                new LocalBlobstoreServiceTestConfig(), new LocalTaskQueueTestConfig(),
                new LocalMemcacheServiceTestConfig(), new LocalUserServiceTestConfig());

        helper
                .setEnvIsLoggedIn(true)
                .setEnvIsAdmin(isAdmin)
                .setUp();
    }

    public LocalServiceTestHelper getHelper() {
        return helper;
    }

    @Override
    protected void after() {
        helper.tearDown();
    }
}
