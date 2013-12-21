<%@ tag import="bd.BD" %>
<%@ tag import="bd.NextHealthTec" %>
<%@ tag import="bd.UserFromApp" %>
<%@ tag import="com.google.appengine.api.users.User" %>
<%@ tag import="com.google.appengine.api.users.UserService" %>
<%@ tag import="com.google.appengine.api.users.UserServiceFactory" %>
<%@tag description="role" pageEncoding="UTF-8" %>
<%@variable name-given="userFromApp" variable-class="bd.UserFromApp" %>
<%
    UserFromApp userFromApp = UserFromApp.create();
    UserService userService = UserServiceFactory.getUserService();
    if (userService.isUserLoggedIn()) {
        User currentUser = UserServiceFactory.getUserService().getCurrentUser();
        NextHealthTec nextHealthTec = BD.ofy().load().type(NextHealthTec.class).filter("email =", currentUser.getEmail()).first().now();


        if (nextHealthTec != null) {
            userFromApp.setId(currentUser.getUserId());
            userFromApp.setHealthTec(true);
            userFromApp.setEmail(currentUser.getEmail());
            userFromApp.save();
            nextHealthTec.delete();
        }
    }
    jspContext.setAttribute("userFromApp", userFromApp);
%><jsp:doBody/>
