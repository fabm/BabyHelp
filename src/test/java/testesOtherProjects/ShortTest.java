package testesOtherProjects;

import com.google.appengine.api.capabilities.Capability;
import com.google.appengine.api.capabilities.CapabilityStatus;
import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.tools.development.testing.LocalCapabilitiesServiceTestConfig;
import com.google.appengine.tools.development.testing.LocalServiceTestHelper;
import org.junit.After;
import org.junit.Assert;
import org.junit.Test;


/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 19/01/14
 * Time: 20:19
 * To change this template use File | Settings | File Templates.
 */
public class ShortTest {
    private LocalServiceTestHelper helperDS;

    @After
    public void tearDown() {
        helperDS.tearDown();
    }

    @Test
    public void testDisabledDatastore() {
        Capability testOne = new Capability("datastore_v3");
        CapabilityStatus testStatus = CapabilityStatus.ENABLED;
        //Initialize
        LocalCapabilitiesServiceTestConfig config =
                new LocalCapabilitiesServiceTestConfig().setCapabilityStatus(testOne, testStatus);
        helperDS = new LocalServiceTestHelper(config);
        helperDS.setUp();
        FetchOptions fo = FetchOptions.Builder.withLimit(10);
        DatastoreService ds = DatastoreServiceFactory.getDatastoreService();
        Assert.assertEquals(0, ds.prepare(new Query("yam")).countEntities(fo));
    }
}
