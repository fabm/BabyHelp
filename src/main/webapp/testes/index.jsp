<%@page pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags/tests" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="jsd" tagdir="/WEB-INF/tags/componentes/jsDepend" %>
<%@ taglib prefix="cp" tagdir="/WEB-INF/tags/componentes" %>

<jsp:useBean id="m" class="pt.babyHelp.managers.teste.teste2.TesteManager"/>

<c:set var="idForm" value="form-test"/>
<c:set var="idButtonOk" value="button-ok"/>
<c:set var="class-remove-user" value="class-buttons-remove-user"/>

<jsd:oneButtonSubmit manager="${m}" idForm="${idForm}" idOkButton="${idButtonOk}"/>
<jsd:tableRowButton manager="${m}" idForm="${idForm}" classButtons="${classButtons-remove-user}"/>

<t:masterTest manager="${m}">
    <jsp:attribute name="content">
        <c:set var="p" value="terceiro"/>
        <c:set var="cac">
            <p>segundo</p>
            <p>${p}</p>
            <t:testeTag><p>quarto</p></t:testeTag>
        </c:set>
        <p>primeiro</p>
        ${cac}
        <form id="${idForm}">
            <t:testInput i="${m.inputContainer.inteiro}"/>
            <t:testInput i="${m.inputContainer.mail}"/>
            <button id="${idButtonOk}">enviar</button>
        </form>
        <cp:layer/>
    </jsp:attribute>
</t:masterTest>