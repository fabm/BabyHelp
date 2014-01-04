package managerTest;

import pt.babyHelp.core.Manager;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 31/12/13
 * Time: 18:26
 * To change this template use File | Settings | File Templates.
 */
public class ManagerTest extends Manager<InputsTest> {
    @Override
    protected void afterCatch() {
        System.out.println("after catch");
    }

    @Override
    public InputsTest createInputContainer() {
        return new InputsTest();
    }

    @Override
    protected void problemInReflectionsCall(Exception ex) {
        try {
            throw ex;
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
