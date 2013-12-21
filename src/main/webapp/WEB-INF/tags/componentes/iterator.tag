<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@tag description="Iterator" pageEncoding="UTF-8" %>
<%@attribute name="bean" type="controller.IteratorHelper" required="true" %>
<%while (bean.hasNext()){bean.next();%><jsp:doBody/><%}%>