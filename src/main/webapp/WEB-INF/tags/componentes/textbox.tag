<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@tag description="textbox" pageEncoding="UTF-8" %>
<%@attribute name="name" required="true" %>
<%@attribute name="value" required="true" %>
<input type="text" name="${name}" value="${value}"/>
