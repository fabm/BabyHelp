<%@ tag import="controller.ControllerBean" %>
<%@tag description="panel" pageEncoding="UTF-8" %>
<%@attribute name="name" required="true" %>
<%
ControllerBean controllerBean = (ControllerBean)application.getAttribute("controllerBean");
    if(controllerBean.isPanelVisible(name)){%><jsp:doBody/><%}%>