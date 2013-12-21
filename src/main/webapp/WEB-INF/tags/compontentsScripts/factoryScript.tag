<%@ tag import="pt.babyHelp.core.webComponents.WebComponent" %>
<%@ tag import="pt.babyHelp.core.webComponents.Form" %>
<%@tag description="factoryScript" pageEncoding="UTF-8" %>
<%@attribute name="javascript" %>
<%@attribute name="componentManager" type="pt.babyHelp.core.webComponents.ComponentManager" %>
<%for(WebComponent wc :componentManager.getComponets()){
    if(wc instanceof Form){%><jsp:invoke fragment=""<%}}
%>