<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<%@ page language="java" import="java.util.*" pageEncoding="ISO-8859-1"%>
<%@ page language="java" import="tatacomm.dbmigration.dbutil.ConnectDatabase" %>
<%@  page language="java" import="com.vsnl.cnms.cnmsutil.UniqueId"%>
<jsp:directive.page import="java.sql.Connection"/>
<jsp:directive.page import="java.sql.Statement"/>

<meta http-equiv="X-UA-Compatible" content="IE=8" >

<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Automated Cramer ISC</title>

<link rel="stylesheet" type="text/css" href="../ext_js/ux/css/Spinner.css" />
  <link rel="stylesheet" type="text/css" href="../ext_js/resources/css/ext-all.css"/>
	<link rel="stylesheet" type="text/css" href="../ext_js/shared/icons/silk.css"/>
   
</head>
<body>


<%
 	String SERVICEID = request.getParameter("serviceName");
 	String IPTYPEPORT = request.getParameter("IPTYPEPORT");
 	String SERVICE_TYPE = request.getParameter("serviceType");
 	String SERVICEIDINPUT = request.getParameter("serviceName");
 	String customerName = request.getParameter("customerName");
	String userName = request.getParameter("uname");
 	
 	
 	String uniqueProcessId="";
 	uniqueProcessId = UniqueId.getUniqueId();
	
	out.write(" <form name='hiddenFields' method='post'>"+
	" <table>"+
		"<tr>"+
			"<td>"+
				" <input type='hidden' name=hiddenServiceName id=hiddenServiceNameId value="+SERVICEID+" />"+
				" <input type='hidden' name=hiddenServiceType id=hiddenServiceTypeId value='"+SERVICE_TYPE+"' />"+
				"<input type='hidden' name=hiddenIpTypeId id=hiddenIpTypeId value="+IPTYPEPORT+" />"+
				"<input type='hidden' name=hiddencustomerName id=hiddencustomerNameId value='"+customerName+"' />"+
				"<input type='hidden' name=hiddenuserName id=hiddenuserNameId value="+userName+" />"+
				"<input type='hidden' name=hiddenuniqueProcessId id=uniqueProcessId value="+uniqueProcessId+" />"+
			"</td>"+
		"</tr>"+
	"</table>	"+
   " </form>");			  
	
	
	
			 
%>

<!-- ** CSS ** -->
	<!-- base library -->
    <link rel="stylesheet" type="text/css" href="../ext_js/resources/css/ext-all.css" />
    
 
 	<!-- ** Javascript ** -->
    <!-- ExtJS library: base/adapter -->
    <script type="text/javascript" src="../ext_js/adapter/ext/ext-base.js"></script>

    <!-- ExtJS library: all widgets -->
    <script type="text/javascript" src="../ext_js/ext-all.js"></script>
    <!--  script type="text/javascript" src="js_scripts/Common.js"></script --> 
    
       <script type="text/javascript" src="../ext_js/ux/Spinner.js"></script>
     <script type="text/javascript" src="../ext_js/ux/SpinnerField.js"></script>
    
    
    <script type="text/javascript" src="js_scripts/BasicCustomerDetails.js"></script>
	<script type="text/javascript" src="js_scripts/WIMAX.js"></script> 
	<script type="text/javascript" src="js_scripts/NNIWithProtection.js"></script>	
	<script type="text/javascript" src="js_scripts/WimaxForALU.js"></script> 
	<script type="text/javascript" src="js_scripts/NNIForALU.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/EthOnSwitchWOTx.js"></script> 
	<script type="text/javascript" src="../ipautomation/scripts/EthOnSwitchWTx.js"></script>
	
	<script type="text/javascript" src="../ipautomation/scripts/EthOnRouterWOTx.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/EthOnRouterWTx.js"></script>
	
	
	
	  <script type="text/javascript" src="../ipautomation/scripts/PDHV35.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/PDHG703.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/SerialchanlSTMKLM.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/PosPortDirectToRouter.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/MultipleVlanUpgrade.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/RadwinSwitch.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/Elan.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/Elan04Card.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/Sme.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/PDHDedicatedE1.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/DedicatedE1OvrChanlSTM.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/N64KDedicatedE1.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/N64KDedicatedE1OvrChanlSTM.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/RoadWarrior.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/vutm.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/EthernetScenario.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/EthernetScenarioWTx.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/AccessRFQ.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/WiMaxForAccess.js"></script>
    <script type="text/javascript" src="../ipautomation/scripts/NNIForAccess.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/AccessSharedLM.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/AccessIntraCityIntraRing.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/AccessIntraCityCommonUni.js"></script>
	
	<script type="text/javascript" src="js_scripts/GetPortType.js"></script>   
	<script type="text/javascript" src="js_scripts/index.js"></script>
	 
	 <script type="text/javascript" src="../ipautomation/scripts/IPAutomationILL.js"></script>
	<script type="text/javascript" src="../ipautomation/scripts/IPAutomationVPN.js"></script>
	 
	<script type="text/javascript" src="../ipautomation/scripts/IPAutomation.js"></script>
	

	
	<input type = "hidden" name="coverageForIllAutomation" id = "coverageForIllAutomation" value = "">
	<input type = "hidden" name="routerForIllAutomation" id = "routerForIllAutomation" value = "">
	 
	 <form id='formTemp1'  name='formTemp1' target="_blank" action='' method='post' onsubmit="calla()">
	 	<input type='hidden' name='reportUrl1' id='reportUrl1' value=''>
	 </form> 
	 
</body>
</html>