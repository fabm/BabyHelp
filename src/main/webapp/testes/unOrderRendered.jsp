<%@page pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="tpl" tagdir="/WEB-INF/tags/tpl" %>
<%@ taglib prefix="cp" tagdir="/WEB-INF/tags/tests" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:useBean id="t" class="pt.babyHelp.managers.teste.teste1.Teste"/>
<tpl:master manager="${t}">

    <jsp:attribute name="conteudo">
        <c:set var="p" value="terceiro"/>
        <c:set var="cac">
            <p>segundo</p>
            <p>${p}</p>
            <cp:testeTag><p>quarto</p></cp:testeTag>
        </c:set>
        <p>primeiro</p>
        ${cac}
    </jsp:attribute>
</tpl:master>