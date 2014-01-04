package pt.babyHelp.core.webComponents.fragments;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 23/12/13
 * Time: 21:31
 * To change this template use File | Settings | File Templates.
 */
public class FragmentsCollector {

    private StringBuilder fragJS;
    private StringBuilder fragJQ;
    private StringBuilder fragCSS;

    public void addFragmentJS(String string){
        if(fragJS==null){
            fragJS= new StringBuilder();
        }
        fragJS.append(string);
    }
    public void addFragmentJQ(String string){
        if(fragJQ==null){
            fragJQ= new StringBuilder();
        }
        fragJQ.append(string);
    }
    public void addFragmentCSS(String string){
        if(fragCSS==null){
            fragCSS= new StringBuilder();
        }
        fragCSS.append(string);
    }

    public String getStrFragJS(){
        return fragJS.toString();
    }
    public String getStrFragJQ(){
        return fragJQ.toString();
    }
    public String getStrFragCSS(){
        return fragCSS.toString();
    }
}
