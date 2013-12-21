<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@tag description="errorLabel" pageEncoding="UTF-8" %>
<%@attribute name="isShown" required="true" %>
<c:if test="${isShown}">
    <div class="erro"><jsp:doBody/></div>
</c:if>