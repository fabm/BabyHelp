package pt.babyHelp.managers;


import pt.babyHelp.core.Manager;
import pt.babyHelp.core.annotationsManager.Request;
import pt.babyHelp.core.annotationsManager.Session;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 29/11/13
 * Time: 22:36
 * To change this template use File | Settings | File Templates.
 */
public class Teste extends Manager {
    private int a ;
    private Object panels;

    public Object getPanels() {
        return panels;
    }

    public void setPanels(Object panels) {
        this.panels = panels;
    }

    public int getA() {
        return a;
    }

    @Request(name = "teste")
    public void setA(String a) {
        this.a = Integer.parseInt(a);
    }

    @Session
    public String getTeste(){
        return "mundo";
    }


    @Override
    protected Object getNewIputsInstance() {
        return null;  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    protected void problemInReflectionsCall(Exception ex) {
        //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public boolean pageValidatation() {
        return false;  //To change body of implemented methods use File | Settings | File Templates.
    }

    @Override
    public void afterValidatation() {
        //To change body of implemented methods use File | Settings | File Templates.
    }
}
