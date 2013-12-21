<%@ page import="bd.Foto" %>
<%@ page import="com.google.appengine.api.users.UserService" %>
<%@ page import="com.google.appengine.api.users.UserServiceFactory" %>
<%@ page import="java.util.List" %>
<%@ page import="com.google.appengine.api.users.User" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%--
  Created by IntelliJ IDEA.
  Caster: francisco
  Date: 19/10/13
  Time: 12:07
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
</head>
<body>

<% Foto foto = new Foto();
    UserService service = UserServiceFactory.getUserService();
    User cu = service.getCurrentUser();
if(cu!=null){
%>
<%
    List<Foto> lista = foto.getFotosDoUtilizador(cu.getUserId());
%>

<%for(Foto f:lista){%>
<img src="/serve?blob-key=<%=f.getBlob()%>" height="100px" width="100px"/>
<%}%>
<div>
    <%=cu.getUserId()%>
</div>
<a href="<%=service.createLogoutURL("/lista.jsp")%>">logout</a>

<%
    }else{
%>
não existe nenhum utilizador logado faça o <a href="<%=service.createLoginURL("/lista.jsp")%>">login</a>

<%
    }
%>
</body>
</html>