package testesOtherProjects.emumExtension;

import junit.framework.Assert;
import org.junit.Test;

public class TestEnums {

    @Test
    public void testParticular1() {
        GlobalConstants.TypeA gcTypeA = GlobalConstants.TypeA.A;
        ParticularConstants.TypeA pcTypeA = ParticularConstants.TypeA.A;

        Assert.assertTrue(pcTypeA.related(gcTypeA));
    }

    @Test
    public void testParticular2() {
        GlobalConstants.TypeA gcTypeA = GlobalConstants.TypeA.A;
        ParticularConstants2.TypeA pcTypeAvA = ParticularConstants2.TypeA.A;
        ParticularConstants2.TypeA pcTypeAvB = ParticularConstants2.TypeA.B;

        Assert.assertTrue(pcTypeAvA.related(gcTypeA));
        Assert.assertFalse(pcTypeAvB.related(gcTypeA));
    }

    @Test
    public void testGenericEnum() {
        Enum e;
        GlobalConstants.TypeA tg = null;
        ParticularConstants2.TypeA tp = null;
        e = GlobalConstants.TypeA.A;
        Assert.assertTrue(e instanceof GlobalConstants.TypeA);
        Assert.assertTrue(e == GlobalConstants.TypeA.A);

        e = ParticularConstants2.TypeA.A;

        Assert.assertTrue(e == ParticularConstants2.TypeA.A);
        e = null;
        Assert.assertNull(e);
    }

    @Test
    public void testParticular3() {
        ParticularConstants3.TypeA pTypeA =
                ParticularConstants3.TypeA.INHERITANCE.set(GlobalConstants.TypeA.B);

        Assert.assertTrue(pTypeA.equals(GlobalConstants.TypeA.B));
        Assert.assertFalse(pTypeA.equals(GlobalConstants.TypeA.A));
        Assert.assertFalse(pTypeA.equals(ParticularConstants3.TypeA.C));

        pTypeA = ParticularConstants3.TypeA.C;
        Assert.assertTrue(pTypeA.equals(ParticularConstants3.TypeA.C));
        Assert.assertFalse(pTypeA.equals(GlobalConstants.TypeA.A));
        Assert.assertFalse(pTypeA.equals(ParticularConstants3.TypeA.D));


    }


}
