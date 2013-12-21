<%@ page import="org.kefirsf.bb.BBProcessorFactory" %>
<%@ page import="org.kefirsf.bb.TextProcessor" %>
<%@ page import="org.kefirsf.bb.conf.Configuration" %>
<%@ page import="org.kefirsf.bb.proc.BBProcessor" %>
<%@ page import="bbcode.Decoder" %>
<%--
  Created by IntelliJ IDEA.
  Caster: francisco
  Date: 23/10/13
  Time: 21:32
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<html>
<head>
    <title></title>
</head>
<body>
<%=Decoder.bbcode(request.getParameter("editor1"))%>
</body>
</html>