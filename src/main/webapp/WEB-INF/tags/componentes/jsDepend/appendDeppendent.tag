<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@tag description="jqueryTools" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@attribute name="manager" type="pt.babyHelp.core.Manager" required="true" %>
<%@attribute name="tittle" required="true" %>
<%if (manager.getDependenciesSet().add(tittle)) {%>
<%if(request.getAttribute("sb")!=null){
    throw new UnavailableException("The name sb is already ocupied");}%>
<c:set var="sb" scope="request"><jsp:doBody/></c:set>
<%
        manager.appendString(request.getAttribute("sb").toString());
        request.removeAttribute("sb");
    }
%>