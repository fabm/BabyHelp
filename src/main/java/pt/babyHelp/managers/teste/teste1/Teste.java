package pt.babyHelp.managers.teste.teste1;


import pt.babyHelp.core.Manager;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 29/11/13
 * Time: 22:36
 * To change this template use File | Settings | File Templates.
 */
public class Teste extends Manager<TestComponents> {




    @Override
    protected void afterCatch() {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public TestComponents createInputContainer() {
        return new TestComponents();  //To change body of implemented methods use File | Settings | File Templates.
    }


    @Override
    protected void problemInReflectionsCall(Exception ex) {
        //To change body of implemented methods use File | Settings | File Templates.
    }

}
