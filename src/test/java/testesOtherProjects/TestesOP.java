package testesOtherProjects;

import junit.framework.Assert;
import org.junit.Test;
import testesOtherProjects.interfacesWithEnums.GeneralConstants;
import testesOtherProjects.interfacesWithEnums.ParticularConstants;

import java.lang.reflect.Field;
import java.util.Calendar;

public class TestesOP {
    @Test
    public void test() throws IllegalAccessException, NoSuchFieldException {
        ClassTest objTest = new ClassTest();

        objTest.setInteger(5);

        Field campoString = ClassTest.class.getDeclaredField("string");
        Field campoInteger = ClassTest.class.getDeclaredField("integer");
        Field campoI = ClassTest.class.getDeclaredField("i");

        campoString.setAccessible(true);
        campoInteger.setAccessible(true);
        campoI.setAccessible(true);

        Assert.assertEquals(campoInteger.get(objTest), 5);
        Assert.assertNull(campoString.get(objTest));
        Assert.assertEquals(campoI.get(objTest), 0);
    }

    @Test
    public void convertionFromGlobal() {
        Assert.assertSame(
                getTypeConverted(GeneralConstants.TypeEnum.ENUM_A),
                ParticularConstants.TypeEnum.A
        );
    }

    @Test
    public void convertionToGlobal() {
        Assert.assertSame(
                getTypeConverted(ParticularConstants.TypeEnum.A),
                GeneralConstants.TypeEnum.ENUM_A
        );
    }

    @Test
    public void convertionFromGlobalEx() {
        try {
            ParticularConstants.TypeEnum.
                    fromGlobal(GeneralConstants.TypeEnum.ENUM_C);
            Assert.assertTrue(false);
        } catch (MissedEnumException ex) {
            Assert.assertEquals(ex.getItemValue(), GeneralConstants.TypeEnum.ENUM_C);
            Assert.assertEquals(ex.getSourceClass(), GeneralConstants.TypeEnum.class);
            Assert.assertEquals(ex.getDestinyClass(), ParticularConstants.TypeEnum.class);
        }
    }

    @Test
    public void equalityEnumStrings() {
        Assert.assertTrue(GeneralConstants.TypeEnum.D.toString() == ParticularConstants.TypeEnum.D.toString());
    }

    private GeneralConstants.TypeEnum getTypeConverted(ParticularConstants.TypeEnum particularEnum) {
        return particularEnum.toGlobal();
    }

    private ParticularConstants.TypeEnum getTypeConverted(GeneralConstants.TypeEnum globalEnum) {
        return ParticularConstants.TypeEnum.fromGlobal(globalEnum);
    }

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
