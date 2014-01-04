<%@tag description="javascriptDependences" pageEncoding="UTF-8"  %>
<%@attribute name="manager" type="pt.babyHelp.core.Manager" required="true" %>
<%=manager.getJavascriptSB()%>
<%if(manager.getSbInsideJQuery()!=null){%>
<script>
    $(document).ready(function () {
        <%=manager.getSbInsideJQuery().toString()%>
    });
</script>
<%}%>