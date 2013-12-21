<%@ tag import="com.google.appengine.api.users.UserServiceFactory" %>
<%@tag description="login" pageEncoding="UTF-8" %>
<%
    String url, label;
    if(UserServiceFactory.getUserService().isUserLoggedIn()){
        url = UserServiceFactory.getUserService().createLogoutURL(request.getRequestURI());
        label = "logout";
    }else{
        url = UserServiceFactory.getUserService().createLoginURL(request.getRequestURI());
        label="login";
    }
%><a href="<%=url%>"><%=label%></a>