package testesOtherProjects;

import junit.framework.Assert;
import org.junit.Test;
import java.lang.reflect.Field;
import java.util.Calendar;

public class TestesOP {

    @Test
    public void differenceBetweenCalendars() throws InterruptedException {
        for (int i = 0; i < 10; i++) {

            Calendar instance1 = Calendar.getInstance();
            Thread.sleep(3010);
            Calendar instance2 = Calendar.getInstance();

            instance2 = (Calendar) instance1.clone();
            instance2.add(Calendar.MILLISECOND,-20);

            System.out.println("instance1:" + instance1.get(Calendar.MILLISECOND));
            System.out.println("instance2:" + instance2.get(Calendar.MILLISECOND));
        }
    }


}
