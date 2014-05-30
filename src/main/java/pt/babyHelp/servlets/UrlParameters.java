package pt.babyHelp.servlets;

import javax.servlet.http.HttpServletRequest;
import java.util.ArrayList;
import java.util.List;

public class UrlParameters {
    static List<String> getParameters(HttpServletRequest req) {
        String pathInfo = req.getPathInfo();
        if (pathInfo != null && !pathInfo.isEmpty()) {
            String[] arr = req.getPathInfo().split("/");
            if(arr.length == 0) return new ArrayList<String>(0);
            List<String> list = new ArrayList<String>(arr.length-1);
            for (int i = 1; i < arr.length; i++) {
                list.add(i-1,arr[i]);
            }
            return list;
        } else
            return new ArrayList<String>(0);
    }
}
