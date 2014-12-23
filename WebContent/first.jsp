<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
    
    <%@ taglib uri="/struts-tags" prefix="s" %>  
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Insert title here</title>
</head>
<body>
<!-- <form action="empData" method="post">
<center>
<br><br>
Employee ID : 
<input type ="text" id = "empid"/> <br><br>
<input type = "submit" value="Get Data"/>
</center>
</form> -->

<s:form action="employee">
<s:textfield name="id" label="EMP ID"></s:textfield>
<s:textfield name="name" label="EMP NAME"></s:textfield>
<s:submit value="save"></s:submit> 
</s:form>



</body>
</html>
