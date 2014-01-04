<%@page pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="tpl" tagdir="/WEB-INF/tags/tpl" %>
<%@ taglib prefix="cp" tagdir="/WEB-INF/tags/componentes" %>
<%@ taglib prefix="jsd" tagdir="/WEB-INF/tags/componentes/jsDepend" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>

<jsp:useBean id="m" class="pt.babyHelp.managers.index.IndexManager"/>

<c:set var="idForm" value="form-test"/>
<c:set var="idButtonOk" value="button-ok"/>
<c:set var="classButtons-remove-user" value="class-buttons-remove-user"/>

<jsd:tableRowButton manager="${m}"
                    classButtons="${classButtons-remove-user}" idForm="${idForm}"/>
<jsd:oneButtonSubmit manager="${m}" idForm="${idForm}" idOkButton="${idButtonOk}"/>

<tpl:master manager="${m}">

    <jsp:attribute name="conteudo">
        <c:if test="${m.validator.admin}">
            <tpl:index-administrator m="${m}" button-remove="${classButtons-remove-user}"/>
            <div class="modal" id="yesno" style="position: fixed; z-index: 0; top: 200px; left: 528px; display: none;">
                <h2>${m.bundle.confirmRemotionTitle}</h2>
                <form action="removerht.jsp" id="form-remove-user">
                    <p>
                        <button class="close" id="buttonYes">${m.bundle.buttonYes}</button>
                        <button class="close" id="buttonNo">${m.bundle.buttonNo}</button>
                    </p>
                </form>
            </div>
            <div id="exposeMask"
                 style="position: absolute; top: 0px; left: 0px; width: 1440px; height: 511px; display: none; opacity: 1; z-index: 9998; background-color: rgb(235, 236, 255);"></div>
        </c:if>
        <c:if test="${!m.validator.admin}">
            Olá utilizador
        </c:if>
    </jsp:attribute>
</tpl:master>