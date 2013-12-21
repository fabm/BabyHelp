<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@taglib prefix="cp" tagdir="/WEB-INF/tags/componentes" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="tpl" tagdir="/WEB-INF/tags/tpl" %>
<jsp:useBean id="m" class="pt.babyHelp.managers.removeManager.RemoveManager"/>
<tpl:master manager="${m}">
    <jsp:attribute name="conteudo">
        <c:if test="${m.removeValidator.admin}">
            <c:if test="${m.withoutRequests}">${m.bundle.missingData}</c:if>
            <c:if test="${m.pageValid}">${m.roleUpdatedMSG}</c:if>
            <c:if test="${m.removeValidator.nextHealthTecDoesntExists or
            m.removeValidator.userFromAppDoesntExists}">${m.bundle.userDoesntExists}</c:if>
        </c:if>
        <c:if test="${!m.removeValidator.admin}">${m.bundle.roleDoesNotAdmin}</c:if>
        <a href="/">Voltar</a>
    </jsp:attribute>
</tpl:master>