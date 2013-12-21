package pt.babyHelp.core;

/**
 * Created with IntelliJ IDEA.
 * User: francisco
 * Date: 30/11/13
 * Time: 12:28
 * To change this template use File | Settings | File Templates.
 */
public class ReflectionNamesManager {
    public static String nameFromAcessor(String acessor){
        StringBuilder sb = new StringBuilder(acessor.substring(3));
        sb.setCharAt(0,Character.toLowerCase(sb.charAt(0)));
        return sb.toString();
    }
    private static String nameToAcessor(String acessor, String name){
        StringBuilder sb = new StringBuilder(acessor);
        sb.append(name);
        sb.setCharAt(3,Character.toUpperCase(sb.charAt(3)));
        return sb.toString();
    }

    public static String nameToGetter(String name){
        return nameToAcessor("get",name);
    }
    public static String nameToSetter(String name){
        return nameToAcessor("set",name);
    }

    public static String upperCamelCase(String str){
        StringBuilder sb = new StringBuilder(str);
        sb.setCharAt(0,Character.toUpperCase(sb.charAt(0)));
        return sb.toString();
    }

    public static String lowerCamelCase(int begin,String str){
        return lowerCamelCase(str.substring(begin));
    }
    public static String lowerCamelCase(String str){
        StringBuilder sb = new StringBuilder(str);
        sb.setCharAt(0,Character.toLowerCase(sb.charAt(0)));
        return sb.toString();
    }
}
