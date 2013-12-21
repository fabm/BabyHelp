package pt.babyHelp.core.webComponents;

import java.util.ArrayList;
import java.util.List;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 19/12/13
 * Time: 22:57
 * To change this template use File | Settings | File Templates.
 */

public abstract class WebComponent {
    private ArrayList<Dependece> dependencesList;

    public abstract String getID();

    public abstract String getName();

    public List<Dependece> getDependences(){
        if(dependencesList==null){
            dependencesList=new ArrayList<Dependece>();
        }
        return dependencesList;
    }
}