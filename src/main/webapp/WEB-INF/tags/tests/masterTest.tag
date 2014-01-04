<%@tag description="principal" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="cp" tagdir="/WEB-INF/tags/componentes" %>
<%@ taglib prefix="jsd" tagdir="/WEB-INF/tags/componentes/jsDepend" %>
<%@attribute name="css" fragment="true" %>
<%@attribute name="javascript" fragment="true" %>
<%@attribute name="content" fragment="true" required="true" %>
<%@attribute name="manager" type="pt.babyHelp.core.Manager" required="true" %>
<%
        manager.setRequest(request);
%>
<!DOCTYPE html>

<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta name="keywords" content=""/>
    <meta name="description" content=""/>
    <meta http-equiv="content-type" content="text/html; charset=utf-8"/>
    <title>Baby Help!</title>
    <jsp:invoke fragment="css"/>
    <link href="/style/style.css" rel="stylesheet" type="text/css" media="screen"/>
    <link href="/style/style.css" rel="stylesheet" type="text/css"/>
    <jsp:invoke fragment="javascript"/>
    <jsd:javascriptDependences manager="${manager}"/>
</head>
<body>
<div id="wrapper">
    <div id="header">
        <div id="logo">
            <h1><a id="loginLink" href="~/Account/Login.aspx">Baby Help</a></h1>
        </div>
        <div class="loginBox">
            <cp:login/>
        </div>
    </div>
    <div id="menu">
        <ul>
            <li>
                <a href="#">Inicio</a>
            </li>
            <li>
                <a href="#">Filhos</a>
            </li>
            <li>
                <a href="#">Amigos</a>
            </li>
            <li>
                <a href="#">Sobre o projecto...</a>
            </li>
        </ul>
    </div>
    <!-- end #menu -->
    <div id="page">
        <div id="page-bgtop">
            <div id="page-bgbtm">
                <div id="content" style="min-height: 400px">
                    <jsp:invoke fragment="content"/>
                </div>
                <!-- end #content -->
                <div id="sidebar">
                    <ul>
                        <li>
                            <h2>Favoritos</h2>

                            <p>
                                ...
                            </p>

                            <p>
                                ...
                            </p>

                            <p>
                                ...
                            </p>

                            <p>
                                ...
                            </p>
                        </li>
                        <li>
                            <h2>Artigos</h2>
                            <ul>
                                <li>
                                    <a href="#">10/2012</a>
                                </li>
                                <li>
                                    <a href="#">09/2012</a>
                                </li>
                                <li>
                                    <a href="#">08/2012</a>
                                </li>
                                <li>
                                    <a href="#">07/2012</a>
                                </li>
                                <li>
                                    <a href="#">06/2012</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
                <!-- end #sidebar -->
                <div style="clear: both;">
                    &nbsp;
                </div>
            </div>
        </div>
    </div>
    <!-- end #page -->
</div>

<div id="footer">
    <p></p>
</div>
</body>

</html>
<%
    manager.postRendering();
%>