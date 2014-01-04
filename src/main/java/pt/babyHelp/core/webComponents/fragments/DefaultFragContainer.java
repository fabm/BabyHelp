package pt.babyHelp.core.webComponents.fragments;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 23/12/13
 * Time: 21:44
 * To change this template use File | Settings | File Templates.
 */
public class DefaultFragContainer implements FragmentsContainer{
    private FragmentsCollector fragmentsCollector;

    public DefaultFragContainer() {
        this.fragmentsCollector = new FragmentsCollector();
    }

    @Override
    public FragmentsCollector getFragments() {
        return fragmentsCollector;
    }
}
