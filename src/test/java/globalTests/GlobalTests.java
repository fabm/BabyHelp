package globalTests;

import com.google.inject.Guice;
import com.google.inject.Injector;
import org.junit.Test;
import pt.core.BabyHelpServiceSystemModule;
import pt.gapiap.cloud.endpoints.errors.CEError;

import java.util.Calendar;
import java.util.concurrent.ExecutionException;

public class GlobalTests {

  @Test
  public void differenceBetweenCalendars() throws InterruptedException {
    for (int i = 0; i < 10; i++) {

      Calendar instance1 = Calendar.getInstance();
      Thread.sleep(3010);
      Calendar instance2 = Calendar.getInstance();

      instance2 = (Calendar) instance1.clone();
      instance2.add(Calendar.MILLISECOND, -20);

      System.out.println("instance1:" + instance1.get(Calendar.MILLISECOND));
      System.out.println("instance2:" + instance2.get(Calendar.MILLISECOND));
    }
  }

  @Test
  public void testCache() throws ExecutionException, CEError {

    Injector injector = Guice.createInjector(new BabyHelpServiceSystemModule());

  }
}
