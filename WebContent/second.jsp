<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
    <%@ page import="java.util.List" %>
    <%@taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
Output over here is <% List<String> list = (List<String>) request.getAttribute("names");
for(int i=0; i<list.size(); i++)
out.print(list.get(i));
%>
<br>
jstl output <c:forEach var="empllist" items="${empList }">
<tr><td><c:out value="${empllist.id}"></c:out> </td> </tr>
<tr><td><c:out value="${empllist.name}"></c:out> </td> </tr>
</c:forEach>
</body>
</html>