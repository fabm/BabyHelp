<%@tag description="testInput" pageEncoding="UTF-8" %>
<%@attribute name="i" type="pt.babyHelp.core.webComponents.inputs.Input" %>
<input name="${i.name}" type="text" value="${i.value}">
<% Iterable<String> mi = i.getMsgsIterator();for(String s:mi){%>
<div class="erro"><%=s%></div><%}%>