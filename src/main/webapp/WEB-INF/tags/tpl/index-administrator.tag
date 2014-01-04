<%@ tag description="index-administrator" pageEncoding="utf-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="cp" tagdir="/WEB-INF/tags/componentes" %>
<%@ taglib prefix="t" tagdir="/WEB-INF/tags/tests" %>

<%@attribute name="m" type="pt.babyHelp.managers.index.IndexManager" required="true" %>
<%@attribute name="button-remove" required="true" %>
<h1>${m.bundle.healthTecPromotion}</h1>

<c:if test="${!m.validator.formHealthTec}">
    <form>
        <div>
            <t:testInput i="${m.inputContainer.mail}"/>
        </div>
        <input type="submit">
    </form>
</c:if>

<div style="margin-top: 20px;">
    <c:if test="${m.validator.itNextHealthTecHasRows}">
        <h3>${m.bundle.usersWaitingAproval}</h3>
        <table>
            <tr>
                <th colspan="2">${m.bundle.mail}</th>
            </tr>
            <c:forEach items="${m.iteratorNextHealthTec}" var="i">
                <tr>
                    <td>${m.iteratorNextHealthTec.email}</td>
                    <td>
                        <img class="${button-remove}" data-params="type:1,id:${i}" rel="#yesno"
                            src="images/ic_menu_close_clear_cancel.png"
                            width="25px"></a>
                    </td>
                </tr>
            </c:forEach>
        </table>
    </c:if>
    <c:if test="${!m.validator.itNextHealthTecHasRows}">${m.bundle.withoutUsersWaitingAproval}</c:if>
</div>
<div style="margin-top: 20px;">
    <c:if test="${m.validator.itUserFromAppHasRows}">

        <h3>${m.bundle.healthTecs}</h3>
        <table>
            <tr>
                <th colspan="2">${m.bundle.mail}</th>
            </tr>
            <c:forEach items="${m.iteratorUserFromApp}" var="i">
                <tr>
                    <td>${m.iteratorUserFromApp.email}</td>
                    <td><img class="${button-remove}" data-params="type:0,id:${i}" rel="#yesno"
                            src="images/ic_menu_close_clear_cancel.png"
                            width="25px">
                    </td>
                </tr>
            </c:forEach>
        </table>
    </c:if>
    <c:if test="${!m.validator.itUserFromAppHasRows}">${m.bundle.registeredHealthTecs}</c:if>
</div>
<c:if test="${m.pageValid}">
    <div>${m.bundle.successfullInsertionHealthTec}</div>
    <div>${m.alertAfterInsertion}</div>
</c:if>