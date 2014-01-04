<%@tag description="jqueryTools" pageEncoding="UTF-8" trimDirectiveWhitespaces="true" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@attribute name="manager" type="pt.babyHelp.core.Manager" required="true" %>
<%manager.initSbInsideJQuery();%><c:set var="sb" scope="request"><jsp:doBody/></c:set>
<%manager.getSbInsideJQuery().append(request.getAttribute("sb"));
request.removeAttribute("sb");
%>