package pt.babyHelp.core.webComponents;

import java.util.HashSet;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 22/12/13
 * Time: 14:32
 * To change this template use File | Settings | File Templates.
 */
public class DependenciesContainer {
    private HashSet<String> dependenciesSet = new HashSet<String>();
    public boolean addDependencie(String dependencie){
        if(dependencie==null){
            throw new NullPointerException("Dependencie must be a string");
        }
        return dependenciesSet.add(dependencie);
    }
}
