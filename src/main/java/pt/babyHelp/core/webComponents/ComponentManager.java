package pt.babyHelp.core.webComponents;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 21/12/13
 * Time: 19:57
 * To change this template use File | Settings | File Templates.
 */
public class ComponentManager {
    private ArrayList<WebComponent> components;

    public List<WebComponent> getComponets(){
        if(components==null){
            components = new ArrayList<WebComponent>();
        }
        return components;
    }
}
