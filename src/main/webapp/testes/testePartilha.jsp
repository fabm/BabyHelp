<%@ page import="bd.Foto" %>
<html>
<head>
    <title>Teste partilha</title>
</head>
<body>
<div>pagina de teste de partilha</div>

<%=Foto.load(6262818231812096L).getBlob()%>

</body>
</html>