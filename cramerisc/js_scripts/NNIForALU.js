var allocateIpButton_NNIALU = new Ext.Button(
	{
		text: 'Allocate IP',
		id: 'Allocate_IP',
		disabled : true,
		handler: function(){
		IllorGvpnIpAutomation(nniForALUWin);
	}
	});
/** Start: This method is called recursively, to udpate the CLR Creation status in POP-up for User */
function checkNNIALUCircuitStatus(){

	Ext.Ajax.request({

		url : '../servlet/EthernetScenarioServlet.cnms' ,
		params : { method : 'checkCircuitCreationStatus',
		requestTrackingID: requestTrackingID
	},
	method: 'POST',
	success: function ( result, request ) {
		var jsonData = Ext.util.JSON.decode(result.responseText);
		if(jsonData.success == true){
			//Ext.MessageBox.alert('Success', 'Circuit Creation Completed Successfully. IP Bearer/L2 Tunnel :'+jsonData.ipborl2tunnelname,function() {
			Ext.MessageBox.alert('Success', 'Circuit Creation Completed Successfully!!',function() {
				Ext.getCmp('createCircuitNNIALU-id').disable();
				//window.location= redirectUrl;
			});
			allocateIpButton_NNIALU.setDisabled(false);
			//Ext.getCmp('createCircuitNNIALU-id').disable();
		}else if(jsonData.result != " " && jsonData.result != "FAILED"){
			Ext.MessageBox.show({

				title: 'Please wait',
				msg:  jsonData.result,
				width:300,
				closable:false
			});
			setTimeout("checkNNIALUCircuitStatus()",5000);

		}else if(jsonData.success == false && jsonData.result == "FAILED"){
			Ext.getCmp('createCircuitNNIALU-id').disable();
			Ext.MessageBox.alert('Result', "Circuit Creation Failed");
		}
	}
	});
}
/** End: This method is called recursively, to udpate the CLR Creation status in POP-up for User */
Ext.onReady(function(){

	Ext.QuickTips.init();

	Ext.form.Field.prototype.msgTarget = 'side';

	Ext.BLANK_IMAGE_URL = 'resources/images/default/s.gif';

	Ext.Ajax.timeout = 9000000; 
	var topologyDumpTable='';
	var IpPortType =  document.hiddenFields.hiddenIpTypeId.value;
	var circuitTableName='';
	var cloudID = '';
	var node2location = '';
	var eBBtwSwitchToCloud = '';
	var typeOfNode = '';	
	var routerHostName = '';var routerHostNameProt = '';
	var routerHostAlias = '';var routerHostAliasProt = '';
	var routerHostIpAddress ='';var routerHostIpAddressProt ='';
	var topologyTableName = '';var topologyTableNameProt = '';
	var zEndPortForCloud = '';
	var alias1 = '';
	var isDotInterface = false;var isDotInterfaceProt = false;
	var router = '';var routerNameProt='';
	var portNameQosProt = '';var isNNIProtectionCase = false;
	var iorNameProt = '';var zEndPortForCloudProt = '';
	var ipBearerPortNameProt = '';var cloudIDProt ='';
	var node2locationProt ='';var eBBtwSwitchToCloudProt = '';
	var typeOfNodeProt ='';var nniIpBearerPortNameProt = '';
	var routerHostIpAddressProt = '';
	var isALUcase = 'false';
	var isALUcaseProt = 'false';
	var VLANRangeIdProt = '';
	var seVLANIdProt = undefined;
	var portId = '';
	var portIdProt = '';

	var nniRouterHostNameStore = new Ext.data.JsonStore({
		url: '../GetComboJson.cnms',
		baseParams:{comboId:'GetRouterHostNameNni'},
		fields: [
			{name: 'combovalue'},
			{name: 'comboid'}
			]
	});
	var nniRouterHostNameStoreProt = new Ext.data.JsonStore({
		url: '../GetComboJson.cnms',
		baseParams:{comboId:'GetRouterHostNameNni'},
		fields: [
			{name: 'combovalue'},
			{name: 'comboid'}
			]
	});
	var NNICPENodeStore = new Ext.data.JsonStore( {
		url :'../GetComboJson.cnms',
		baseParams : {comboId :'GetCPENodeWimax'},
		fields : [ {name :'combovalue'},
			{name :'comboid'} 
		]
	});
	var nniVLANCategoryStore = new Ext.data.JsonStore({
		url: '../GetComboJson.cnms',
		baseParams:{comboId:'getVLANCategoryName'},
		fields: [
			{name: 'combovalue'},
			{name: 'comboid'}
			]
	});

	function vlanNameGenerationNNI(){
		if(isALUcase == 'true' || isALUcase == true) {	// If ALU setup
			vlanNameGenerationNNINewSetup();
		}
		else {	// If CISCO/Existing logic
				vlanNameGenerationNNIOldSetup();
		}
	};
	function vlanNameGenerationNNIProt(){		
		if(isALUcaseProt == 'true' || isALUcaseProt == true) {	// If ALU setup
			vlanNameGenerationNNIProtNewSetup();
		}
		else {	// If CISCO/Existing logic
			vlanNameGenerationNNIProtOldSetup();
		}
	};
	function vlanNameGenerationNNIOldSetup() {
		var strArray = '';
		var vlanValue = '';
		var strValues = 0;
		var num = '';
		var content = '';
		var index = 0;
		num = Ext.getCmp('nniNoOfVlanALU-id').getValue();
		content = Ext.getCmp('nniVlanFreeOnRouterALU-id').getValue();
		strArray = content.split(",");
		for ( var j = 0; j < strArray.length; j++) {
			if (strArray[j] != '' && strArray[j] != null) {
				strValues++;
			}
		}
		//if (Ext.getCmp('specialQosLoopingReqdNni-id').checked == false && isDotInterface == false) {
		if (Ext.getCmp('specialQosLoopingReqdNniALU-id').checked == false) {
			//interfaceName = "Vlan";
			if(portNameQos=='' || portNameQos==null){
				if (typeOfNode == "ROUTER") {
					if (isDotInterface == true) {
						var namePort = Ext.getCmp('routerToCloudPortNameALU-id').getValue();
						if(namePort!=null){
							portNameQos = namePort;
						}
					}
				} else if (typeOfNode == "SWITCH") {
					if (topologyType == 'LINEAR') {
						if(portName!=null){
							portNameQos = portName;
						}
					}
				}
			}
			if(topologyType == 'LINEAR' || isDotInterface == true) {
				interfaceName = portNameQos + ".";
			}else if(topologyType != 'LINEAR'){
				interfaceName = "Vlan";
			}
		} else if(Ext.getCmp('specialQosLoopingReqdNniALU-id').checked == true || isDotInterface == true){
			if(portNameQos=='' || portNameQos==null){
				if (typeOfNode == "ROUTER") {
					if (isDotInterface == true) {
						var namePort = Ext.getCmp('routerToCloudPortNameALU-id').getValue();
						if(namePort!=null){
							portNameQos = namePort;
						}
					}
				} else if (typeOfNode == "SWITCH") {
					if (topologyType == 'LINEAR') {
						if(portName!=null){
							portNameQos = portName;
						}
					}
				}
			}
			interfaceName = portNameQos + ".";
			if(portNameQos == undefined 
					&& Ext.getCmp('nniVlanFreeOnRouterALU-id').getValue() != "0"
						&& Ext.getCmp('nniVlanFreeOnRouterALU-id').getValue() != ""){
				Ext.MessageBox.alert('Result', "Looping Port Not Found. Unchecking QoS Loop checkbox.");
				Ext.getCmp('nniIpBearerPortNameALU-id').setValue("");
				Ext.getCmp('specialQosLoopingReqdNniALU-id').setValue("0");
				vlanNameGenerationNNIOldSetup();
				return;
			}
		}
		if (num < strValues) {
			alert("You have to enter " + num + " Vlan numbers Only");
			for ( var j = 0; j < num; j++) {
				vlanValue = vlanValue + interfaceName + strArray[j] + ",";
			}
			index = content.lastIndexOf(strArray[num]);
			Ext.getCmp('nniVlanFreeOnRouterALU-id').setValue(
				content.substring(0, index - 1));
			ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
			Ext.getCmp('nniIpBearerPortNameALU-id').setValue(ipBearerPortName);
		} else if (num == strValues) {
			for ( var i = 0; i < num; i++) {
				vlanValue = vlanValue + interfaceName + strArray[i] + ",";
			}
			ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
			Ext.getCmp('nniIpBearerPortNameALU-id').setValue(ipBearerPortName);
		} else if (num > strValues) {
			alert("You have to enter lesser Vlan numbers ");
			Ext.getCmp('nniVlanFreeOnRouterALU-id').setValue("");
			Ext.getCmp('nniIpBearerPortNameALU-id').setValue("");
		}
	};
	function vlanNameGenerationNNINewSetup(){		
		var strArray = '';
		var vlanValue = '';
		var strValues = 0;
		var num = '';
		var content = '';
		var index=0;
		num = Ext.getCmp('nniNoOfVlanALU-id').getValue();
		content = Ext.getCmp('nniVlanFreeOnRouterALU-id').getValue();
		strArray = content.split(",");
		for(var j=0;j<strArray.length;j++){
			if(strArray[j]!='' && strArray[j]!=null){
				strValues++;
			}
		}
		if(typeOfNode == "ROUTER"){			
			portNameQos = Ext.get('routerToCloudPortNameALU-id').dom.value;
		}
		else {
			portNameQos = portName;
		}
		if(Ext.getCmp('outerVlanNniALU-id').getValue() == '' || Ext.getCmp('outerVlanNniALU-id').getValue() == undefined){
			interfaceName = portNameQos + ".";
			//interfaceName = Ext.getCmp('ethAluRouterfreeport-id').getValue()+".";			
		}
		else {
			interfaceName = portNameQos + ":"+
			Ext.getCmp('outerVlanNniALU-id').getValue()+".";
			//			interfaceName = Ext.getCmp('ethAluRouterfreeport-id').getValue()+":"+
			//								Ext.getCmp('outerVlanEthScWoTx-id').getValue()+".";
		}

		if(num < strValues)
		{
			alert("You have to enter "+num+" Vlan numbers Only");
			for(var j=0;j<num;j++){
				vlanValue = vlanValue+interfaceName+strArray[j]+",";
			}
			index = content.lastIndexOf(strArray[num]);
			Ext.getCmp('nniVlanFreeOnRouterALU-id').setValue(content.substring(0,index-1));
			ipBearerPortName = vlanValue.substring(0, vlanValue.length-1);
			Ext.getCmp('nniIpBearerPortNameALU-id').setValue(ipBearerPortName);
		}else if(num == strValues){
			for(var i=0;i<num;i++){
				vlanValue = vlanValue+interfaceName+strArray[i]+",";
			}			
			ipBearerPortName = vlanValue.substring(0, vlanValue.length-1);
			Ext.getCmp('nniIpBearerPortNameALU-id').setValue(ipBearerPortName);
		}else if (num >strValues){
			alert("You have to enter lesser Vlan numbers ");
			Ext.getCmp('nniVlanFreeOnRouterALU-id').setValue("");
			Ext.getCmp('nniIpBearerPortNameALU-id').setValue("");
		}
	};
	function vlanNameGenerationNNIProtOldSetup() {
		var strArray = '';
		var vlanValue = '';
		var strValues = 0;
		var num = '';
		var content = '';
		var index = 0;
		num = Ext.getCmp('nniNoOfVlanProtALU-id').getValue();
		content = Ext.getCmp('nniVlanFreeOnRouterProtALU-id').getValue();
		strArray = content.split(",");
		for ( var j = 0; j < strArray.length; j++) {
			if (strArray[j] != '' && strArray[j] != null) {
				strValues++;
			}
		}
		if (Ext.getCmp('specialQosLoopingReqdNniProtALU-id').checked == false && isDotInterfaceProt == false) {
			interfaceNameProt = "Vlan";
		} else if(Ext.getCmp('specialQosLoopingReqdNniProtALU-id').checked == true || isDotInterfaceProt == true){
			if(portNameQosProt == '' || portNameQosProt == null){
				if (typeOfNodeProt == "ROUTER") {
					if (isDotInterfaceProt == true) {
						var namePort = Ext.getCmp('routerToCloudPortNameProtALU-id').getValue();
						if(namePort!=null){
							portNameQosProt = namePort;
						}
					}
				} else if (typeOfNodeProt == "SWITCH") {
					if (topologyTypeProt == 'LINEAR') {
						if(portNameProt!=null){
							portNameQosProt = portNameProt;
						}
					}
				}
			}
			interfaceNameProt = portNameQosProt + ".";
			if(portNameQosProt == undefined 
					&& Ext.getCmp('nniVlanFreeOnRouterProtALU-id').getValue() != "0"
						&& Ext.getCmp('nniVlanFreeOnRouterProtALU-id').getValue() != ""){
				Ext.MessageBox.alert('Result', "Looping Port Not Found. Unchecking QoS Loop checkbox.");
				Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue("");
				Ext.getCmp('specialQosLoopingReqdNniProtALU-id').setValue("0");
				vlanNameGenerationNNIProtOldSetup();
				return;
			}
		}
		if (num < strValues) {
			alert("You have to enter " + num + " Vlan numbers Only");
			for ( var j = 0; j < num; j++) {
				vlanValue = vlanValue + interfaceNameProt + strArray[j] + ",";
			}
			index = content.lastIndexOf(strArray[num]);
			Ext.getCmp('nniVlanFreeOnRouterProtALU-id').setValue(
				content.substring(0, index - 1));
			ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
			Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue(ipBearerPortNameProt);
		} else if (num == strValues) {
			for ( var i = 0; i < num; i++) {
				vlanValue = vlanValue + interfaceNameProt + strArray[i] + ",";
			}
			ipBearerPortNameProt = vlanValue.substring(0, vlanValue.length - 1);
			Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue(ipBearerPortNameProt);
		} else if (num > strValues) {
			alert("You have to enter lesser Vlan numbers ");
			Ext.getCmp('nniVlanFreeOnRouterProtALU-id').setValue("");
			Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue("");
		}
	};
	function vlanNameGenerationNNIProtNewSetup(){	

		var strArray = '';
		var vlanValue = '';
		var strValues = 0;
		var num = '';
		var content = '';
		var index=0;
		num = Ext.getCmp('nniNoOfVlanProtALU-id').getValue();
		content = Ext.getCmp('nniVlanFreeOnRouterProtALU-id').getValue();
		strArray = content.split(",");
		for(var j=0;j<strArray.length;j++){
			if(strArray[j]!='' && strArray[j]!=null){
				strValues++;
			}
		}
		if(typeOfNodeProt == "ROUTER"){	
			portNameQosProt = Ext.get('routerToCloudPortNameProtALU-id').dom.value;			
		}
		else {
			portNameQosProt = portName;
		}
		if(Ext.getCmp('outerVlanNniProtALU-id').getValue() == '' || Ext.getCmp('outerVlanNniProtALU-id').getValue() == undefined){
			interfaceName = portNameQosProt + ".";	
			//interfaceName = Ext.getCmp('ethAluRouterfreeport-id').getValue()+".";			
		}
		else {
			interfaceName = portNameQosProt + ":"+
			Ext.getCmp('outerVlanNniProtALU-id').getValue()+".";
			//			interfaceName = Ext.getCmp('ethAluRouterfreeport-id').getValue()+":"+
			//								Ext.getCmp('outerVlanEthScWoTx-id').getValue()+".";
		}

		if(num < strValues)
		{
			alert("You have to enter "+num+" Vlan numbers Only");
			for(var j=0;j<num;j++){
				vlanValue = vlanValue+interfaceName+strArray[j]+",";
			}
			index = content.lastIndexOf(strArray[num]);
			Ext.getCmp('nniVlanFreeOnRouterProtALU-id').setValue(content.substring(0,index-1));
			ipBearerPortName = vlanValue.substring(0, vlanValue.length-1);
			Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue(ipBearerPortName);
		}else if(num == strValues){
			for(var i=0;i<num;i++){
				vlanValue = vlanValue+interfaceName+strArray[i]+",";
			}			
			ipBearerPortName = vlanValue.substring(0, vlanValue.length-1);
			Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue(ipBearerPortName);
		}else if (num >strValues){
			alert("You have to enter lesser Vlan numbers ");
			Ext.getCmp('nniVlanFreeOnRouterProtALU-id').setValue("");
			Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue("");
		}
	};
	function getIpBearerPortNameQosNni(){

		Ext.Ajax.request({
			url : '../NNIALUServlet.cnms' , 
			params : { method : 'getIpBearerPortNameQos',
			data1: routerHostAlias//Ext.get('nniRouterHostName-id').dom.value 
		},
		method: 'POST',
		success: function ( result, request ) { 
			var jsonData = Ext.util.JSON.decode(result.responseText);
			portNameQos = jsonData.IPBEARERPORTNAME;
			vlanNameGenerationNNI();
			if(portNameQos == undefined){
				Ext.getCmp('nniIpBearerPortNameALU-id').setValue("");
				Ext.MessageBox.alert('Failed', 'Ethernet Bearer Loop not present. Please uncheck QoS Looping');
			}
		},
		failure: function ( result, request) { 
			Ext.MessageBox.alert('Failed', result.responseText); 
		}
		});
	}
	function getIpBearerPortNameQosNniProt(){

		Ext.Ajax.request({
			url : '../NNIALUServlet.cnms' , 
			params : { method : 'getIpBearerPortNameQos',
			data1: routerHostAliasProt//Ext.get('nniRouterHostName-id').dom.value 
		},
		method: 'POST',
		success: function ( result, request ) { 
			var jsonData = Ext.util.JSON.decode(result.responseText);
			portNameQosProt = jsonData.IPBEARERPORTNAME;
			vlanNameGenerationNNIProt();
			if(portNameQosProt == undefined){
				Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue("");
				Ext.MessageBox.alert('Failed', 'Ethernet Bearer Loop not present. Please uncheck QoS Looping');
			}
		},
		failure: function ( result, request) { 
			Ext.MessageBox.alert('Failed', result.responseText); 
		}
		});
	}

	var nniALUForm = new Ext.form.FormPanel({
		baseCls: 'x-plain',
		labelWidth: 190,
		frame:true,
		autoHeight: true,
		listeners:{
		afterrender : function(){
		NNICPENodeStore.on('load',function(){
			Ext.getCmp('NNICPENameALU-id').setValue("1900000180");
		});
		NNICPENodeStore.load();
	}
	},
	items: [
		{
			xtype : 'checkbox',
			fieldLabel: 'Special QOS Looping Required',
			id: 'specialQosLoopingReqdNniALU-id',
			listeners:{
			check : function(){

			if(Ext.getCmp('specialQosLoopingReqdNniALU-id').checked == true
					&& Ext.get('nniRouterHostNameALU-id').getValue() != '' ){ //Special QOS Looping Data
				getIpBearerPortNameQosNni();

			}else {
				if(topologyType == 'LINEAR'  && Ext.get('nniRouterHostNameALU-id').getValue() != ''){
					portNameQos = portName;
				}
				getIpBearerPortNameQosNni();
			}
		}
		}
		}, {
			xtype: 'textfield',
			fieldLabel: 'NNI ID',
			id: 'NNIALU_ID',
			name: 'nni_alu_id_name',
			anchor:'95%',  
			listeners: {
			change: function(){
			
			nniALUForm.getEl().mask('Fetching NNI Details..');			
			Ext.Ajax.request({
				url : '../NNIALUServlet.cnms' , 
				params : { method : 'getSwitchDetails',
				data1: Ext.get('NNIALU_ID').dom.value,
				serviceType: Ext.get('serviceType-id').dom.value,
				uniqueNniId: uniqueProcessId },				
				method: 'POST',
				success: function ( result, request ) { 
					var jsonData = Ext.util.JSON.decode(result.responseText);

					Ext.getCmp('cloudALU-id').setValue(jsonData.cloudName);

					cloudID = jsonData.cloudId;	
					eBBtwSwitchToCloud = jsonData.eBBtwSwitchToCloud;	
					Ext.getCmp('cloudPortIdALU-id').setValue(jsonData.cloudPortId);
					Ext.getCmp('cloudPortAlias1ALU-id').setValue(jsonData.cloudPortAlias1);
					typeOfNode = jsonData.typeOfNode;																													
					node2location = jsonData.node2location;
					alias1 = jsonData.alias1;
					zEndPortForCloud = jsonData.zEndPortForCloud;
					zEndPortIdForCloud = jsonData.zEndPortIdForCloud;

					if(jsonData.typeOfNode == "ROUTER"){

						Ext.getCmp('switchToCloudHostNameALU-id').disable();
						Ext.getCmp('switchIpAddressALU-id').disable();
						Ext.getCmp('nniRouterHostNameALU-id').disable();
						Ext.getCmp('nniRouterIpAddressALU-id').disable();
						Ext.getCmp('switchToCloudPortNameALU-id').disable();

						Ext.getCmp('routerToCloudHostNameALU-id').setValue(jsonData.routerToCloudHostName);
						Ext.getCmp('routerToCloudPortNameALU-id').setValue(jsonData.zEndPortForCloud);

						routerHostName = jsonData.zEndNodeForCloudId; //Ext.getCmp('routerToCloudHostName-id').getValue();
						isALUcase = jsonData.isALUcase;
						routerHostAlias = Ext.get('routerToCloudHostNameALU-id').dom.value;
						routerHostIpAddress = jsonData.zEndNodeForCloudNameIpAddr;
						Ext.getCmp('routerConnectedToCloudIpAddressALU-id').setValue(jsonData.zEndNodeForCloudNameIpAddr);

						portId = jsonData.zEndPortIdForCloud;

						Ext.getCmp('routerToCloudHostNameALU-id').focus();
						Ext.MessageBox.alert('Result', " Cloud Is Attached To Router Directly");

						if(alias1 == "DOTINTERFACE"){
							isDotInterface = true;
						}

					}else if(jsonData.typeOfNode == "SWITCH"){

						Ext.getCmp('routerToCloudHostNameALU-id').disable();
						Ext.getCmp('routerConnectedToCloudIpAddressALU-id').disable();
						Ext.getCmp('routerToCloudPortNameALU-id').disable();
						Ext.getCmp('switchToCloudHostNameALU-id').setValue(jsonData.switchToCloudHostName);
						Ext.getCmp('switchToCloudPortNameALU-id').setValue(jsonData.zEndPortForCloud);
						Ext.getCmp('switchIpAddressALU-id').setValue(jsonData.zEndNodeForCloudNameIpAddr);
						Ext.getCmp('switchToCloudHostIdALU-id').setValue(jsonData.zEndNodeForCloudId);

						topologyTableName = jsonData.topologyTableName;

						nniRouterHostNameStore.setBaseParam('tableName',topologyTableName);
						nniRouterHostNameStore.load();
						isALUcase = jsonData.isALUcase;
						portId = jsonData.zEndPortIdForCloud;
						//isALUcase = true, then call the outer vlan ajax
						if(isALUcase == "true"){
							//Ext.MessageBox.alert("Enter into ALUcase");
							portName = jsonData.routerUplinkName;
							Ext.Ajax.request({
								url : '../servlet/EthernetScenarioServlet.cnms' ,
								params : { method : 'getSEVLANForAS',
									portId: zEndPortIdForCloud
								},
								method: 'POST',
								success: function ( result, request ) {						
									var jsonData = Ext.util.JSON.decode(result.responseText);
									seVLANName = jsonData.seVLANName;
									seVLANId = jsonData.seVLANId;									
									Ext.getCmp('outerVlanNniALU-id').setValue(seVLANName);
								},
								failure : function(result, request)
								{
									Ext.MessageBox.alert('Failed',result.responseText);
								}											
							});
						}
					}else if(jsonData.error == "InvalidNNI"){
						Ext.MessageBox.alert('Result', "Provided NNI-ID is not a Valid Service or IOR Name");	
					}else if(jsonData.error == "NonCloud"){
						Ext.MessageBox.alert('Result', "Neither End is of Type Cloud");	
					}
					isNNIProtectionCase = false;

					if(jsonData.iorName_Prot != undefined){// If Dual NNI case
						isNNIProtectionCase = true;

						iorNameProt = jsonData.iorName_Prot;
						Ext.getCmp('nniProtectionDetailsALU-id').show();

						Ext.getCmp('cloudProtALU-id').setValue(jsonData.cloudName_Prot);

						cloudIDProt = jsonData.cloudId_Prot;	
						eBBtwSwitchToCloudProt = jsonData.eBBtwSwitchToCloud_Prot;	
						Ext.getCmp('cloudPortIdProtALU-id').setValue(jsonData.cloudPortId_Prot);
						Ext.getCmp('cloudPortAlias1ProtALU-id').setValue(jsonData.cloudPortAlias1_Prot);
						typeOfNodeProt = jsonData.typeOfNode_Prot;

						Ext.getCmp('NNIALU_IDProt').setValue(jsonData.iorName_Prot);

						node2locationProt = jsonData.node2location_Prot;
						alias1Prot = jsonData.alias1_Prot;

						if(jsonData.typeOfNode_Prot == "ROUTER"){

							Ext.getCmp('switchToCloudHostNameProtALU-id').disable();
							Ext.getCmp('switchIpAddressProtALU-id').disable();
							Ext.getCmp('nniRouterHostNameProtALU-id').disable();
							Ext.getCmp('nniRouterIpAddressProtALU-id').disable();
							Ext.getCmp('switchToCloudPortNameProtALU-id').disable();

							Ext.getCmp('routerToCloudHostNameProtALU-id').setValue(jsonData.routerToCloudHostName_Prot);
							Ext.getCmp('routerToCloudPortNameProtALU-id').setValue(jsonData.zEndPortForCloud_Prot);

							routerHostNameProt = jsonData.zEndNodeForCloudId_Prot; //Ext.getCmp('routerToCloudHostName-id').getValue();
							routerHostAliasProt = Ext.get('routerToCloudHostNameProtALU-id').dom.value;
							routerHostIpAddressProt = jsonData.zEndNodeForCloudNameIpAddr_Prot;
							Ext.getCmp('routerConnectedToCloudIpAddressProtALU-id').setValue(jsonData.zEndNodeForCloudNameIpAddr_Prot);
							zEndPortForCloudProt = jsonData.zEndPortForCloud_Prot;

							portIdProt = jsonData.zEndPortIdForCloud_Prot;

							if(alias1Prot == "DOTINTERFACE"){
								isDotInterfaceProt = true;
							}

						}else if(jsonData.typeOfNode_Prot == "SWITCH"){

							Ext.getCmp('routerToCloudHostNameProtALU-id').disable();
							Ext.getCmp('routerConnectedToCloudIpAddressProtALU-id').disable();
							Ext.getCmp('routerToCloudPortNameProtALU-id').disable();
							Ext.getCmp('switchToCloudHostNameProtALU-id').setValue(jsonData.switchToCloudHostName_Prot);
							Ext.getCmp('switchToCloudPortNameProtALU-id').setValue(jsonData.zEndPortForCloud_Prot);
							Ext.getCmp('switchIpAddressProtALU-id').setValue(jsonData.zEndNodeForCloudNameIpAddr_Prot);
							Ext.getCmp('switchToCloudHostIdProtALU-id').setValue(jsonData.zEndNodeForCloudId_Prot);

							topologyTableNameProt = jsonData.topologyTableName_Prot;

							nniRouterHostNameStoreProt.setBaseParam('tableName',topologyTableNameProt);
							nniRouterHostNameStoreProt.load();

							isALUcaseProt = jsonData.isALUcase_Prot;
							portIdProt = jsonData.zEndPortIdForCloud_Prot;
							
							//isALUcase = true, then call the outer vlan ajax
							if(isALUcaseProt == "true"){
								portNameProt = jsonData.routerUplinkName_Prot;
								Ext.Ajax.request({
									url : '../servlet/EthernetScenarioServlet.cnms' ,
									params : { method : 'getSEVLANForAS',
										portId: jsonData.zEndPortIdForCloud_Prot
									},
									method: 'POST',
									success: function ( result, request ) {						
										var jsonData = Ext.util.JSON.decode(result.responseText);
										seVLANNameProt = jsonData.seVLANName;
										seVLANIdProt = jsonData.seVLANId;									
										Ext.getCmp('outerVlanNniProtALU-id').setValue(seVLANName);
									},
									failure : function(result, request)
									{
										Ext.MessageBox.alert('Failed',result.responseText);
									}											
								});
							}

						}else if(jsonData.error_Prot == "InvalidNNI"){
							Ext.MessageBox.alert('Result', "Protected NNI-ID is not a Valid Service or IOR Name");	
						}else if(jsonData.error_Prot == "NonCloud"){
							Ext.MessageBox.alert('Result', "Neither End is of Type Cloud for Protection IOR");	
						}
					}															
					nniALUForm.getEl().unmask();	
				},
				failure: function ( result, request) { 
					Ext.MessageBox.alert('Failed', result.responseText); 
				}
			});            			
		}
		}
		},{       	 
			xtype: 'textfield',
			id: 'switchToCloudHostIdALU-id',
			name: 'switchToCloudHostALUId',
			anchor:'95%',
			hidden : true       	 
		},{       	 
			xtype: 'textfield',
			fieldLabel: 'Aggregation Switch/Business Switch Connected To Cloud',
			id: 'switchToCloudHostNameALU-id',
			name: 'switchToCloudHostALUName',
			anchor:'95%'        	 
		},{       	 
			xtype: 'textfield',
			fieldLabel: 'Aggregation/Business Switch Port Name',
			id: 'switchToCloudPortNameALU-id',
			name: 'switchToCloudPortNameALU',
			anchor:'95%'       	 
		},{       	 
			xtype: 'textfield',
			fieldLabel: 'Switch IP Address',
			id: 'switchIpAddressALU-id',
			name: 'switchIpAddressALU',
			anchor:'95%'        	 
		},{       	 
			xtype: 'textfield',
			fieldLabel: 'Router Connected To Cloud',
			id: 'routerToCloudHostNameALU-id',
			name: 'routerToCloudHostNameALU',
			anchor:'95%'  	 
		},{       	 
			xtype: 'textfield',
			fieldLabel: 'Router Port Name',
			id: 'routerToCloudPortNameALU-id',
			name: 'routerToCloudPortNameALU',
			anchor:'95%'      	 
		},{       	 
			xtype: 'textfield',
			fieldLabel: 'Router Connected To Cloud IP',
			id: 'routerConnectedToCloudIpAddressALU-id',
			name: 'routerConnectedToCloudIpAddressALU',
			anchor:'95%' 
		},{
			xtype: 'textfield',
			id: 'cloudPortIdALU-id',
			name: 'cloudPortId',
			anchor:'95%',
			hidden : true       	 
		},{       	 
			xtype: 'textfield',
			id: 'cloudPortAlias1ALU-id',
			name: 'cloudPortAlias1ALU',
			anchor:'95%', 
			hidden : true       	 
		},{       	 
			xtype: 'textfield',
			fieldLabel: 'Cloud',
			id: 'cloudALU-id',
			name: 'cloudNameALU',
			allowBlank:false,
			anchor:'95%' 	 
		},{
			xtype: 'combo',
			fieldLabel: 'Router Host Name',
			id: 'nniRouterHostNameALU-id',
			name: 'nniRouterHostNameALU',
			triggerAction: 'all',
			editable : false,
			mode: 'local',
			anchor:'95%',
			allowBlank:false,
			store: nniRouterHostNameStore,
			displayField:'combovalue',
			valueField:'comboid',	
			listeners : {
			select : function(){
			
			Ext.getCmp('nniVLANCategoryALU-id').setValue("");
			Ext.Ajax.request({
				url : '../EthWOTxNOVlan.cnms' ,
				params : { method : 'getRouterIP',
				data1: Ext.get('nniRouterHostNameALU-id').getValue()
			},
			method: 'POST',
			success: function ( result, request ) {
				var jsonData = Ext.util.JSON.decode(result.responseText);
				Ext.getCmp('nniRouterIpAddressALU-id').setValue(jsonData.RouterIP);
				routerHostAlias = Ext.get('nniRouterHostNameALU-id').dom.value;

				if (isALUcase == false || isALUcase == 'false') {
					Ext.Ajax.request({
						url : '../Nni.cnms' , 
						params : { method : 'getRouterHostDetails',
						data1: Ext.getCmp('nniRouterHostNameALU-id').getValue(),
						data2 : topologyTableName },
						method: 'POST',
						success: function ( result, request ) { 
							var jsonData = Ext.util.JSON.decode(result.responseText);
							Ext.getCmp('nniRouterIpAddressALU-id').setValue(jsonData.routerHostIpAddress);
							topologyType = jsonData.topologyType;
							routerHostName = Ext.getCmp('nniRouterHostNameALU-id').getValue();
							routerHostAlias = Ext.get('nniRouterHostNameALU-id').dom.value;
							routerHostIpAddress = Ext.get('nniRouterIpAddressALU-id').dom.value;
							if(topologyType == 'LINEAR' && Ext.getCmp('specialQosLoopingReqdNni-id').checked == true){

								Ext.MessageBox.alert('Result', "Looping Not Applicable For Linear Topology"); 

							}else if(topologyType =='LINEAR' && Ext.getCmp('specialQosLoopingReqdNni-id').checked == false){
								portName= jsonData.portName;
							}
						},
						failure: function ( result, request) { 
							Ext.MessageBox.alert('Failed', result.responseText); 
						}
					});
				} else if ((isALUcase == true || isALUcase == 'true') 
						&& (Ext.getCmp('switchToCloudHostIdALU-id').getValue() != undefined 
								&& Ext.getCmp('switchToCloudHostIdALU-id').getValue() != '')) {
			
					Ext.Ajax.request({
						url : '../NNIALUServlet.cnms' , 
						params : { method : 'getRouterUplinkPort',
								routerId: Ext.getCmp('nniRouterHostNameALU-id').getValue(),
								switchId: Ext.getCmp('switchToCloudHostIdALU-id').getValue()
						},
						method: 'POST',
						success: function ( result, request ) {
							var jsonData = Ext.util.JSON.decode(result.responseText);
							portId = jsonData.ROUTERUPLINKID;
							portName = jsonData.ROUTERUPLINKALIAS1;
						},
						failure: function ( result, request) { 
							Ext.MessageBox.alert('Failed', result.responseText); 
						}
					});
				}

			},
			failure: function ( result, request) {
				Ext.MessageBox.alert('Failed', result.responseText);
			}
			}); 					 					
		} 				
		}
		},
		{
			xtype: 'textfield',
			fieldLabel: 'Router IP Address',
			id: 'nniRouterIpAddressALU-id',
			name: 'nniRouterIpAddressALU',
			readOnly:true,
			anchor:'95%'  			
		},
		{
			xtype: 'numberfield',
			fieldLabel: 'Outer Vlan',
			id: 'outerVlanNniALU-id',
			name: 'outerVlanNniALU',
			readOnly: true,
			allowBlank: true,
			defaultValue: "0",
			autoCreate:{tag:"input", type:"text", size:"40", autocomplete:"off", qtip: "Please Enter Number of Vlan required"},
			disabled : true,
			anchor:'95%'
		},
		{
			xtype : 'numberfield',
			fieldLabel : 'No of Vlan',
			id : 'nniNoOfVlanALU-id',
			name : 'nniNoOfVlanALU',
			readOnly : false,
			allowBlank : false,
			disabled : false,
			anchor : '95%',
			listeners : {
			render : function() {
			Ext.Ajax.request
			(
				{
					url : '../EthWithTxWTopo.cnms',
					params :
					{
					method : 'checkForMultipleVlanServices',
					serviceType: Ext.get('serviceType-id').dom.value
					},
					method : 'POST',
					success : function(result, request)
					{
						var jsonData = Ext.util.JSON.decode(result.responseText);
						result = jsonData.result;
						if (result == "false")
						{
							Ext.getCmp('nniNoOfVlanALU-id').setValue("1");
							Ext.getDom('nniNoOfVlanALU-id').readOnly = true;
						}
					},
					failure : function(result, request)
					{
						Ext.MessageBox.alert('Failed',result.responseText);
					}
				});
		},
		change : function() {
			Ext.getCmp('nniVLANCategoryALU-id').setValue("");
			Ext.getCmp('nniVlanFreeOnRouterALU-id').setValue("");
			Ext.getCmp('nniIpBearerPortNameALU-id').setValue("");
		}

		}
		},{
			xtype:'combo',
			fieldLabel:'VLAN Category',
			id:'nniVLANCategoryALU-id',
			name:'nniVLANCategoryALU',                
			displayField:'combovalue',
			valueField:'comboid',
			emptyText:'-------- Select ---------',
			blankText:'VLAN Category is Required.',
			store: nniVLANCategoryStore,
			triggerAction:'all',
			mode:'remote',
			anchor:'95%',
			typeAhead: false,
			selectOnFocus:true,
			allowBlank: false,
			forceSelection:true,
			disabled :false,
			minChars : 1,
			listeners : {
			select : function(){
			if(Ext.getCmp('routerToCloudHostNameALU-id').getValue() == "" ||  Ext.getCmp('routerToCloudHostNameALU-id').getValue() == null){
				routerName = Ext.get('nniRouterHostNameALU-id').dom.value;
			}else{
				routerName = Ext.getCmp('routerToCloudHostNameALU-id').getValue();
			}
			if(Ext.get('nniNoOfVlanALU-id').getValue()!= null && Ext.get('nniNoOfVlanALU-id').getValue() !="") {
				Ext.Ajax.request({
					url : '../NNIALUServlet.cnms' ,
					params : { method : 'isALUCaseForNNICase',
					routerName: routerName
				},
				method: 'POST',
				success: function ( result, request ) {
					var jsonData = Ext.util.JSON.decode(result.responseText);
					isALUcase = jsonData.detailsRouter;
					if (isALUcase == true) {
						if (seVLANId == undefined){//else {
							Ext.Ajax.request({
								url : '../servlet/EthernetScenarioServlet.cnms' ,
								params : { method : 'getFreeVLANFromPort',
								portId: portId,
								categoryName : Ext.get('nniVLANCategoryALU-id').dom.value,
								number : Ext.get('nniNoOfVlanALU-id').dom.value
							},
							method: 'POST',
							success: function ( result, request ) {
								var jsonData = Ext.util.JSON.decode(result.responseText);
								VLANRangeId = jsonData.VLANRangeId;
								freeVLANList = jsonData.freeVLANList;
								Ext.getCmp('nniVlanFreeOnRouterALU-id').setValue(freeVLANList);
								vlanNameGenerationNNI();
							},
							failure : function(result, request)	{
								Ext.MessageBox.alert('Failed',result.responseText);
							}											
							});

						} else{
							Ext.Ajax.request({
								url : '../servlet/EthernetScenarioServlet.cnms' ,
								params : { method : 'getFreeVLANFromSEVLAN',
								seVLANId: seVLANId,
								categoryName : Ext.get('nniVLANCategoryALU-id').dom.value,
								number : Ext.get('nniNoOfVlanALU-id').dom.value
							},
							method: 'POST',
							success: function ( result, request ) {
								var jsonData = Ext.util.JSON.decode(result.responseText);
								VLANRangeId = jsonData.VLANRangeId;
								freeVLANList = jsonData.freeVLANList;
								Ext.getCmp('nniVlanFreeOnRouterALU-id').setValue(freeVLANList);
								vlanNameGenerationNNI();
							},
							failure : function(result, request)	{
								Ext.MessageBox.alert('Failed',result.responseText);
							}											
							});
						}

					}
					else { // isALUSetup == false
						Ext.Ajax.request({
							url : '../servlet/EthernetScenarioServlet.cnms' ,
							params : { method : 'getFreeVLANFromNode',
							nodeName : routerName,
							categoryName : Ext.get('nniVLANCategoryALU-id').dom.value,
							number : Ext.get('nniNoOfVlanALU-id').dom.value
						},
						method: 'POST',
						success: function ( result, request ) {
							var jsonData = Ext.util.JSON.decode(result.responseText);
							VLANRangeId = jsonData.VLANRangeId;
							freeVLANList = jsonData.freeVLANList;
							Ext.getCmp('nniVlanFreeOnRouterALU-id').setValue(freeVLANList);
							vlanNameGenerationNNI();
						},
						failure : function(result, request)	{
							Ext.MessageBox.alert('Failed',result.responseText);
						}											
						});
					}
				},
				failure : function(result, request)
				{
					Ext.MessageBox.alert('Failed',result.responseText);
				}											
				});
			}
		}
		}
		},{
			xtype: 'textfield',
			fieldLabel: 'VLAN Free On Router',
			id: 'nniVlanFreeOnRouterALU-id',
			name: 'nniVlanFreeOnRouterALU',
			anchor:'95%', 
			disabled : true,
			readOnly:false,
			allowBlank: false,
			listeners: {
			blur : function(){
			vlanNameGenerationNNI();
		}
		}
		},{
			xtype: 'checkbox',
			name: 'nniVLANAssociatedtoServiceIDALU',
			id: 'nniVLANAssociatedtoServiceIDALU-id',
			fieldLabel: 'VLAN already reserved',
			listeners:{
			check : function()
			{
			if(Ext.getCmp('nniVLANAssociatedtoServiceIDALU-id').checked == true){
				Ext.getCmp('reserveNNIALU').disable();
				Ext.getCmp('createCircuitNNIALU-id').enable();								
				Ext.getCmp('nniVlanFreeOnRouterALU-id').enable();								
				Ext.getCmp('nniVLANCategoryALU-id').disable();								
			}
			if(Ext.getCmp('nniVLANAssociatedtoServiceIDALU-id').checked == false){
				Ext.getCmp('reserveNNIALU').enable();
				Ext.getCmp('createCircuitNNIALU-id').disable();
				Ext.getCmp('nniVlanFreeOnRouterALU-id').disable();
				Ext.getCmp('nniVlanFreeOnRouterALU-id').setValue("");
				Ext.getCmp('nniVLANCategoryALU-id').enable();
				Ext.getCmp('nniVLANCategoryALU-id').setValue("");
				Ext.getCmp('nniIpBearerPortNameALU-id').setValue("");
				
			}
			}
		}			
		},{
			xtype: 'textfield',
			fieldLabel: 'IP Bearer Port Name',
			id: 'nniIpBearerPortNameALU-id',
			name: 'nniIpBearerPortNameALU',
			allowBlank: false,
			readOnly:true,
			anchor:'95%'  		
		},{
			defaults:{xtype:'fieldset', layout:'form', anchor:'100%', autoHeight:true},
			baseCls: 'x-plain',
			//labelWidth: 190,
			//frame:true,
			//autoHeight: true,
			id: 'nniProtectionDetailsALU-id',
			hidden: true,
			//disabled: true,
			//hiddenValue: '',
			items:
				[{
					title:'NNI Protection Details',
					id: 'NNIFieldsALU-id',
					//				    		collapsible: true,
					//				    		collapsed: true,
					//baseCls: 'x-plain',
					//frame : true,
					//defaults:{anchor:'-20', allowBlank:false},
					items:
					{
					id:'fs2col-form1',
					layout:'form',
					baseCls: 'x-plain',
					frame:false,
					//labelWidth:100,
					defaults:
					{

					baseCls: 'x-plain',
					layout:'form',
					hideLabels:false,
					border:false//,
					//bodyStyle:'padding:4px'
					},
					items:
						[{
							defaults:{xtype:'fieldset', layout:'form', anchor:'100%', autoHeight:true},
							items:
								[{
									xtype : 'checkbox',
									fieldLabel: 'Special QOS Looping Required',
									id: 'specialQosLoopingReqdNniProtALU-id',
									hiddenValue: '',
									listeners:{
									check : function(){									 		
									if(Ext.getCmp('specialQosLoopingReqdNniProtALU-id').checked == true){ //Special QOS Looping Data 
										getIpBearerPortNameQosNniProt();						
									}	
									if(typeOfNodeProt == "ROUTER")
									{
										if(isDotInterfaceProt == false){
											if(Ext.getCmp('specialQosLoopingReqdNniProtALU-id').checked == false){															
												ipBearerPortNameProt = "Vlan"+Ext.get('nniVlanFreeOnRouterProtALU-id').getValue();
												Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue(ipBearerPortNameProt);															
											}
										}else{

											var namePort = Ext.getCmp('routerToCloudPortNameProtALU-id').getValue();
											ipBearerPortNameProt = namePort+"."+ Ext.getCmp('nniVlanFreeOnRouterProtALU-id').getValue();
											Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue(ipBearerPortNameProt);
										}
									}
									else if (typeOfNodeProt == "SWITCH"){
										if(topologyTypeProt == 'RING' && Ext.getCmp('specialQosLoopingReqdNniProtALU-id').checked == false){													
											ipBearerPortNameProt = "Vlan"+Ext.get('nniVlanFreeOnRouterProtALU-id').getValue();
											Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue(ipBearerPortNameProt);														
										}																			 
										if(topologyTypeProt == 'LINEAR' && Ext.getCmp('specialQosLoopingReqdNniProtALU-id').checked == false){
											ipBearerPortNameProt = portNameProt+"."+ Ext.getCmp('nniVlanFreeOnRouterProtALU-id').getValue();
											Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue(ipBearerPortNameProt);
										}
									}
								}
								}
								},{
									xtype: 'textfield',
									fieldLabel: 'NNI ID',
									id: 'NNIALU_IDProt',
									name: 'nni_alu_id_nameProt',
									hiddenValue: '',
									anchor:'95%'
								},{							       	 
									xtype: 'textfield',
									id: 'switchToCloudHostIdProtALU-id',
									name: 'switchToCloudHostIdProtALU',
									hiddenValue: '',
									anchor:'95%',
									hidden : true							       	 
								},{							       	 
									xtype: 'textfield',
									fieldLabel: 'Switch Connected To Cloud',
									id: 'switchToCloudHostNameProtALU-id',
									name: 'switchToCloudHostNameProtALU',
									hiddenValue: '',
									anchor:'95%' 
								},{							       	 
									xtype: 'textfield',
									fieldLabel: 'Switch Port Name',
									id: 'switchToCloudPortNameProtALU-id',
									name: 'switchToCloudPortNameALU',
									hiddenValue: '',
									anchor:'95%' 							       	 
								},{							       	 
									xtype: 'textfield',
									fieldLabel: 'Switch IP Address',
									id: 'switchIpAddressProtALU-id',
									name: 'switchIpAddressALU',
									hiddenValue: '',
									anchor:'95%' 
								},{							       	 
									xtype: 'textfield',
									fieldLabel: 'Router Connected To Cloud',
									id: 'routerToCloudHostNameProtALU-id',
									name: 'routerToCloudHostNameProtALU',
									hiddenValue: '',
									anchor:'95%' 
								},{							       	 
									xtype: 'textfield',
									fieldLabel: 'Router Port Name',
									id: 'routerToCloudPortNameProtALU-id',
									name: 'routerToCloudPortNameProtALU',
									hiddenValue: '',
									anchor:'95%' 
								},{							       	 
									xtype: 'textfield',
									fieldLabel: 'Router Connected To Cloud IP',
									id: 'routerConnectedToCloudIpAddressProtALU-id',
									name: 'routerConnectedToCloudIpAddressProtALU',
									hiddenValue: '',
									anchor:'95%' 
								},{
									xtype: 'textfield',
									id: 'cloudPortIdProtALU-id',
									name: 'cloudPortIdProtALU',
									anchor:'95%',
									hiddenValue: '',
									hidden : true							       	 
								},{							       	 
									xtype: 'textfield',
									id: 'cloudPortAlias1ProtALU-id',
									name: 'cloudPortAlias1ProtALU',
									hiddenValue: '',
									anchor:'95%', 
									hidden : true							       	 
								},{							       	 
									xtype: 'textfield',
									fieldLabel: 'Cloud',
									id: 'cloudProtALU-id',
									name: 'cloudNameProtALU',
									allowBlank:false,
									hiddenValue: '',
									anchor:'95%'        	 
								},{
									xtype: 'combo',
									fieldLabel: 'Router Host Name',
									id: 'nniRouterHostNameProtALU-id',
									name: 'nniRouterHostNameProtALU',
									triggerAction: 'all',
									editable : false,
									mode: 'local',
									anchor:'95%',  
									allowBlank:false,
									store: nniRouterHostNameStoreProt,
									hiddenValue: '',
									displayField:'combovalue',
									valueField:'comboid',
									listeners : {
									select : function(){
									Ext.getCmp('nniVLANCategoryProtALU-id').setValue("");
									Ext.Ajax.request({
										url : '../EthWOTxNOVlan.cnms' ,
										params : { method : 'getRouterIP',
											data1: Ext.get('nniRouterHostNameProtALU-id').getValue()
										},
										method: 'POST',
										success: function ( result, request ) {
											var jsonData = Ext.util.JSON.decode(result.responseText);
											Ext.getCmp('nniRouterIpAddressProtALU-id').setValue(jsonData.RouterIP);
											routerHostAliasProt = Ext.get('nniRouterHostNameALUProt-id').dom.value;
											if (isALUcaseProt == false || isALUcaseProt == 'false') {
												Ext.Ajax.request({
													url : '../Nni.cnms' , 
													params : { method : 'getRouterHostDetails',
													data1: Ext.getCmp('nniRouterHostNameProtALU-id').getValue(),
													data2 : topologyTableNameProt },
													method: 'POST',
													success: function ( result, request ) { 
														var jsonData = Ext.util.JSON.decode(result.responseText);
														Ext.getCmp('nniRouterIpAddressProtALU-id').setValue(jsonData.routerHostIpAddress);
														topologyTypeProt = jsonData.topologyType;
														routerHostNameProt = Ext.getCmp('nniRouterHostNameProtALU-id').getValue();
														routerHostAliasProt = Ext.get('nniRouterHostNameProtALU-id').dom.value;
														routerHostIpAddressProt = Ext.get('nniRouterIpAddressProtALU-id').dom.value;
														if(topologyTypeProt == 'LINEAR' && Ext.getCmp('specialQosLoopingReqdNniProtALU-id').checked == true){
							
															Ext.MessageBox.alert('Result', "Looping Not Applicable For Linear Topology"); 
							
														}else if(topologyTypeProt =='LINEAR' && Ext.getCmp('specialQosLoopingReqdNniProtALU-id').checked == false){
															portNameProt= jsonData.portName;
														}
													},
													failure: function ( result, request) { 
														Ext.MessageBox.alert('Failed', result.responseText); 
													}
												});
											} else if ((isALUcaseProt == true || isALUcaseProt == 'true') 
													&& (Ext.getCmp('switchToCloudHostIdProtALU-id').getValue() != undefined 
															&& Ext.getCmp('switchToCloudHostIdProtALU-id').getValue() != '')) {
										
												Ext.Ajax.request({
													url : '../NNIALUServlet.cnms' , 
													params : { method : 'getRouterUplinkPort',
															routerId: Ext.getCmp('nniRouterHostNameProtALU-id').getValue(),
															switchId: Ext.getCmp('switchToCloudHostIdProtALU-id').getValue()
													},
													method: 'POST',
													success: function ( result, request ) {
														var jsonData = Ext.util.JSON.decode(result.responseText);
														portIdProt = jsonData.ROUTERUPLINKID;
														portNameProt = jsonData.ROUTERUPLINKALIAS1;
													},
													failure: function ( result, request) { 
														Ext.MessageBox.alert('Failed', result.responseText); 
													}
												});
											}
	
										},
										failure: function ( result, request) {
											Ext.MessageBox.alert('Failed', result.responseText);
										}
									});
								}							 				
								}
								}	,{
									xtype: 'textfield',
									fieldLabel: 'Router IP Address',
									id: 'nniRouterIpAddressProtALU-id',
									name: 'nniRouterIpAddressProtALU',
									readOnly:true,
									hiddenValue: '',
									anchor:'95%'  										
								},
								{
									xtype: 'numberfield',
									fieldLabel: 'Outer Vlan',
									id: 'outerVlanNniProtALU-id',
									name: 'outerVlanNniProtALU',
									readOnly: true,
									allowBlank: true,
									defaultValue: "0",
									autoCreate:{tag:"input", type:"text", size:"40", autocomplete:"off", qtip: "Please Enter Number of Vlan required"},
									disabled : true,
									anchor:'95%'
								},
								{
									xtype : 'textfield',
									fieldLabel : 'No of Vlan',
									id : 'nniNoOfVlanProtALU-id',
									name : 'nniNoOfVlanProtALU',
									readOnly : false,
									allowBlank : false,
									disabled : false,
									anchor : '95%',
									listeners : {
									render : function() {
									//											if(Ext.get('serviceType-id').dom.value != "GVPN"){
									//												Ext.getCmp('nniNoOfVlanProt-id').setValue("1");
									//												Ext.getDom('nniNoOfVlanProt-id').readOnly = true;
									//											}
									Ext.Ajax.request
									(
										{
											url : '../EthWithTxWTopo.cnms',
											params :
											{
											method : 'checkForMultipleVlanServices',
											serviceType: Ext.get('serviceType-id').dom.value
											},
											method : 'POST',
											success : function(result, request)
											{
												var jsonData = Ext.util.JSON.decode(result.responseText);
												result = jsonData.result;
												if (result == "false")
												{
													Ext.getCmp('nniNoOfVlanProtALU-id').setValue("1");
													Ext.getDom('nniNoOfVlanProtALU-id').readOnly = true;
												}
											},
											failure : function(result, request)
											{
												Ext.MessageBox.alert('Failed',result.responseText);
											}
										});
								},
								change : function() {
									Ext.getCmp('nniVLANCategoryProtALU-id').setValue("");
									Ext.getCmp('nniVlanFreeOnRouterProtALU-id').setValue("");
									Ext.getCmp('nniIpBearerPortNameProtALU-id').setValue("");
								}

								}
								},{
									xtype:'combo',
									fieldLabel:'VLAN Category',
									id:'nniVLANCategoryProtALU-id',
									name:'nniVLANCategoryProtALU',                
									displayField:'combovalue',
									valueField:'comboid',
									emptyText:'-------- Select ---------',
									blankText:'VLAN Category is Required.',
									store: nniVLANCategoryStore,
									triggerAction:'all',
									mode:'remote',
									anchor:'95%',
									typeAhead: false,
									selectOnFocus:true,
									allowBlank: false,
									forceSelection:true,
									disabled :false,
									minChars : 1,
									listeners : {
									select : function(){
									if(Ext.getCmp('routerToCloudHostNameProtALU-id').getValue() == "" ||  Ext.getCmp('routerToCloudHostNameProtALU-id').getValue() == null){
										routerNameProt = Ext.get('nniRouterHostNameProtALU-id').dom.value;
									}else{
										routerNameProt = Ext.getCmp('routerToCloudHostNameProtALU-id').getValue();
									}
									if(Ext.get('nniNoOfVlanProtALU-id').getValue()!= null && Ext.get('nniNoOfVlanProtALU-id').getValue() !="") {
										Ext.Ajax.request({
											url : '../NNIALUServlet.cnms' ,
											params : { method : 'isALUCaseForNNICase',
											routerName: routerNameProt
										},
										method: 'POST',
										success: function ( result, request ) {		
											var jsonData = Ext.util.JSON.decode(result.responseText);
											isALUcaseProt = jsonData.detailsRouter;
											if (isALUcaseProt == true || isALUcaseProt == 'true') {	
												if (seVLANIdProt == undefined){//else {
													Ext.Ajax.request({
														url : '../servlet/EthernetScenarioServlet.cnms' ,
														params : { method : 'getFreeVLANFromPort',
														portId: portIdProt,
														categoryName : Ext.get('nniVLANCategoryProtALU-id').dom.value,
														number : Ext.get('nniNoOfVlanProtALU-id').dom.value
													},
													method: 'POST',
													success: function ( result, request ) {
														var jsonData = Ext.util.JSON.decode(result.responseText);
														VLANRangeIdProt = jsonData.VLANRangeId;
														freeVLANList = jsonData.freeVLANList;
														Ext.getCmp('nniVlanFreeOnRouterProtALU-id').setValue(freeVLANList);
														vlanNameGenerationNNIProt();
													},
													failure : function(result, request)	{
														Ext.MessageBox.alert('Failed',result.responseText);
													}											
													});

												} else{
													Ext.Ajax.request({
														url : '../servlet/EthernetScenarioServlet.cnms' ,
														params : { method : 'getFreeVLANFromSEVLAN',
														seVLANId: seVLANIdProt,
														categoryName : Ext.get('nniVLANCategoryProtALU-id').dom.value,
														number : Ext.get('nniNoOfVlanProtALU-id').dom.value
													},
													method: 'POST',
													success: function ( result, request ) {
														var jsonData = Ext.util.JSON.decode(result.responseText);
														VLANRangeIdProt = jsonData.VLANRangeId;
														freeVLANList = jsonData.freeVLANList;
														Ext.getCmp('nniVlanFreeOnRouterProtALU-id').setValue(freeVLANList);
														vlanNameGenerationNNIProt();
													},
													failure : function(result, request)	{
														Ext.MessageBox.alert('Failed',result.responseText);
													}											
													});	
												}
											}
											else { // isALUSetup == false
												Ext.Ajax.request({
													url : '../servlet/EthernetScenarioServlet.cnms' ,
													params : { method : 'getFreeVLANFromNode',
													nodeName : routerNameProt,
													categoryName : Ext.get('nniVLANCategoryProtALU-id').dom.value,
													number : Ext.get('nniNoOfVlanProtALU-id').dom.value
												},
												method: 'POST',
												success: function ( result, request ) {
													var jsonData = Ext.util.JSON.decode(result.responseText);
													VLANRangeIdProt = jsonData.VLANRangeId;
													freeVLANList = jsonData.freeVLANList;
													Ext.getCmp('nniVlanFreeOnRouterProtALU-id').setValue(freeVLANList);
													vlanNameGenerationNNIProt();
												},
												failure : function(result, request)	{
													Ext.MessageBox.alert('Failed',result.responseText);
												}											
												});
											}
										},
										failure : function(result, request)
										{
											Ext.MessageBox.alert('Failed',result.responseText);
										}											
										});
									}

								}
								}
								},{
									xtype: 'textfield',
									fieldLabel: 'VLAN Free On Router',
									id: 'nniVlanFreeOnRouterProtALU-id',
									name: 'nniVlanFreeOnRouterProtALU',
									anchor:'95%', 
									readOnly:false,
									allowBlank: false,
									hiddenValue: '',
									listeners: {
									blur : function(){
									vlanNameGenerationNNIProt();
								}
								}
								},
								{
									xtype: 'textfield',
									fieldLabel: 'IP Bearer Port Name',
									id: 'nniIpBearerPortNameProtALU-id',
									name: 'nniIpBearerPortNameProtALU',
									hiddenValue: '',
									defaultValue: '',
									readOnly:true,
									allowBlank: false,
									anchor:'95%'  
								}
								// END of Protection form
								]
						}]

					}
				}]  	 					
		},{
			xtype :'combo',
			fieldLabel :'CPE Node',
			id :'NNICPENameALU-id',
			name :'NNICPENameALU',
			triggerAction :'all',				
			anchor :'95%',
			minChars: 0 ,
			allowBlank :false,
			store :NNICPENodeStore,
			displayField :'combovalue',
			valueField :'comboid'			
		},{
			xtype: 'textfield',
			id: 'NNICPEIPALU-id',
			name: 'NNICPEIPALU',
			disabled : true,
			anchor:'95%',  
			hidden : true,
			value : 'Reserved for future use'
		}          
		]
	});

	nniForALUWin = new Ext.Window({
		title: 'NNI (CISCO/Juniper/ALU)',
		width: 480,
		maxHeight:1500,
		x: 500,
		y: 100,
		plain:true,
		bodyStyle:'padding:5px;',
		buttonAlign:'center',
		closable: false,
		layout: 'fit',
		closable: true,
		closeAction : 'hide',
		x: 500,
		y: 100,
		items: nniALUForm,

		buttons: [{
			text: 'Reserve VLAN',
			id: 'reserveNNIALU',            
			handler: function(){

			Ext.MessageBox.show({

				title: 'Please wait',
				msg: 'Reserving VLAN...',
				width:300,
				closable:false,
				animEl: 'Reserve VLAN'
			});		        	
			if(Ext.get('nniVlanFreeOnRouterProtALU-id') == null){ nniVlanFreeOnRouterProt = ''; }
			else nniVlanFreeOnRouterProt = Ext.get('nniVlanFreeOnRouterProtALU-id').dom.value;
			Ext.Ajax.request({		
				url : '../servlet/EthernetScenarioServlet.cnms',
				params :
				{
				method : 'reserveVLANNumber',
				VLANRangeId : VLANRangeId,
				categoryName : Ext.getCmp('nniVLANCategoryALU-id').getValue(),
				vlanNumber : Ext.get('nniVlanFreeOnRouterALU-id').dom.value,
				VLANRangeIdProt : VLANRangeIdProt,
				vlanNumberProt : nniVlanFreeOnRouterProt,
				serviceName : Ext.get('serviceId-id').dom.value,
				uname : userName
				},
				//						            		url : '../EthWithTxWTopo.cnms' , 
				//											params : { method : 'reserveVLANNumber',
				//													   category: Ext.getCmp('nniVLANCategoryALU-id').getValue(),
				//													   router : routerName,
				//													   routerName :Ext.getCmp('nniRouterHostNameALU-id').getValue(),
				//													   vlanNumber :Ext.get('nniVlanFreeOnRouterALU-id').dom.value,
				//													   routerProt : routerNameProt,
				//													   vlanNumberProt :nniVlanFreeOnRouterProt,//Ext.get('nniVlanFreeOnRouterProt-id').dom.value,
				//													   serviceName : Ext.get('serviceId-id').dom.value,
				//													   uname : userName },
				method: 'POST',
				success: function ( result, request ) { 									
					var jsonData = Ext.util.JSON.decode(result.responseText);
					isVlanReserved = jsonData.RESERVED;
					if(isVlanReserved){
						Ext.MessageBox.alert("VLAN Reserved ");
						Ext.getCmp('createCircuitNNIALU-id').enable();	
						Ext.getCmp('reserveNNIALU').disable();
					}
					else{
						Ext.MessageBox.alert("VLAN Reservation Failed ");											
						Ext.getCmp('createCircuitNNIALU-id').disable();
					}
				},
				failure: function ( result, request) { 
					Ext.MessageBox.alert('Failed', result.responseText); 
				}									
			});					     

		}
		},{
			text: 'Create Circuit',
			id: 'createCircuitNNIALU-id',
			disabled: true,
			handler: function(){
			//if(nniALUForm.getForm().isValid()){
			Ext.MessageBox.show({

				title: 'Please wait',
				msg: 'Creating circuit...',
				width:300,
				closable:false,
				animEl: 'Create Circuit'
			});
			if(Ext.get('nniIpBearerPortNameProtALU-id') == null){ nniIpBearerPortNameProt = ''; }
			else nniIpBearerPortNameProt = Ext.get('nniIpBearerPortNameProtALU-id').dom.value;
			if(Ext.get('specialQosLoopingReqdNniProtALU-id') == null){ specialQosLoopingReqdNniProt = ''; }
			else specialQosLoopingReqdNniProt = Ext.getCmp('specialQosLoopingReqdNniProtALU-id').checked;
			if(Ext.get('switchToCloudHostIdProtALU-id') == null){ switchToCloudHostIdProt = ''; }
			else switchToCloudHostIdProt =  Ext.get('switchToCloudHostIdProtALU-id').dom.value;
			if(Ext.get('switchIpAddressProtALU-id') == null){ switchIpAddressProt = ''; }
			else switchIpAddressProt = Ext.get('switchIpAddressProtALU-id').dom.value;
			if(Ext.get('cloudProtALU-id') == null){ cloudProt = ''; }
			else cloudProt = Ext.get('cloudProtALU-id').dom.value;
			if(Ext.get('cloudPortAlias1ProtALU-id') == null){ cloudPortAlias1Prot = ''; }
			else cloudPortAlias1Prot = Ext.get('cloudPortAlias1ProtALU-id').dom.value;
			if(Ext.get('nniVlanFreeOnRouterProtALU-id') == null){ nniVlanFreeOnRouterProt = ''; }
			else nniVlanFreeOnRouterProt = Ext.get('nniVlanFreeOnRouterProtALU-id').dom.value;
			if(Ext.get('switchToCloudHostNameProtALU-id') == null){ switchToCloudHostNameProt = ''; }
			else switchToCloudHostNameProt =  Ext.get('switchToCloudHostNameProtALU-id').dom.value;
			if(Ext.get('switchToCloudPortNameProtALU-id') == null){ switchToCloudPortNameProt = ''; }
			else switchToCloudPortNameProt = Ext.get('switchToCloudPortNameProtALU-id').dom.value;
			if(Ext.get('switchIpAddressProtALU-id') == null){ switchIpAddressProt = ''; }
			else switchIpAddressProt = Ext.get('switchIpAddressProtALU-id').dom.value;

			Ext.Ajax.request({			            			
				url : '../NNIALUServlet.cnms' , 
				params : { method : 'createCircuitNni',

				data1 : circuitTableName,
				serviceName : Ext.get('serviceId-id').dom.value,
				customerName : Ext.getCmp('customerName-id').getValue(), 
				nniId: Ext.get('NNIALU_ID').dom.value,
				peRouterLogicalName : Ext.get('nniIpBearerPortNameALU-id').dom.value, 
				peRouterPortName: Ext.get('routerToCloudPortNameALU-id').dom.value,
				cosReqd : Ext.getCmp('specialQosLoopingReqdNniALU-id').checked,
				switchId : Ext.get('switchToCloudHostIdALU-id').dom.value,
				routerId : routerHostName,
				routerHostAlias : routerHostAlias,
				zEndPortForCloud : zEndPortForCloud,
				btsIP : Ext.get('switchIpAddressALU-id').dom.value,
				topologyTableName : topologyTableName,
				ipBearerPortName	: ipBearerPortName,
				ipPortType : IpPortType,
				uname : userName,
				portNameQos : portNameQos,
				cloudAlias1 : Ext.get('cloudALU-id').dom.value,
				cloudPortAlias1 : Ext.get('cloudPortAlias1ALU-id').dom.value,
				CPEDefId : Ext.getCmp('NNICPENameALU-id').value,
				cpeIp : Ext.get('NNICPEIPALU-id').dom.value,
				cloudId : cloudID,
				node2location : node2location,
				eBBtwSwitchToCloud : eBBtwSwitchToCloud,
				typeOfNode : typeOfNode,
				serviceType : Ext.get('serviceType-id').dom.value,
				noOfVlan : Ext.get('nniNoOfVlanALU-id').dom.value,
				PERouterVlanNo : Ext.get('nniVlanFreeOnRouterALU-id').dom.value,
				PERouterAlias1:  routerHostAlias,
				PERouterLogicalName : Ext.get('nniIpBearerPortNameALU-id').dom.value,
				ROUTER_PEMGMTIP : routerHostIpAddress,
				PESwitchAlias1 : Ext.get('switchToCloudHostNameALU-id').dom.value,
				PESwitchLogicalName_Hoff : Ext.get('switchToCloudPortNameALU-id').dom.value,
				SWITCH_PEMGMTIP : Ext.get('switchIpAddressALU-id').dom.value,
				requestTrackingID:requestTrackingID,
				uniqueNniId: uniqueProcessId,
				routerUplinkPort: portId,

				isNNIProtectionCase : isNNIProtectionCase,
				iorNameProt : iorNameProt,
				peRouterLogicalNameProt : nniIpBearerPortNameProt,//Ext.get('nniIpBearerPortNameProt-id').dom.value, 
				cosReqdProt : specialQosLoopingReqdNniProt,//Ext.getCmp('specialQosLoopingReqdNniProt-id').checked,
				switchIdProt : switchToCloudHostIdProt,//Ext.get('switchToCloudHostIdProt-id').dom.value,
				routerIdProt : routerHostNameProt,
				routerHostAliasProt : routerHostAliasProt,
				zEndPortForCloudProt : zEndPortForCloudProt,
				btsIPProt : switchIpAddressProt,//Ext.get('switchIpAddressProt-id').dom.value,
				topologyTableNameProt : topologyTableNameProt,
				ipBearerPortNameProt	: ipBearerPortNameProt,
				portNameQosProt : portNameQosProt,
				cloudAlias1Prot : cloudProt,//Ext.get('cloudProt-id').dom.value,
				cloudPortAlias1Prot : cloudPortAlias1Prot,//Ext.get('cloudPortAlias1Prot-id').dom.value,
				//CPEDefId : Ext.getCmp('NNICPEName-id').value,
				//cpeIp : Ext.get('NNICPEIP-id').dom.value,
				cloudIdProt : cloudIDProt,
				node2locationProt : node2locationProt,
				eBBtwSwitchToCloudProt : eBBtwSwitchToCloudProt,
				typeOfNodeProt : typeOfNodeProt,
				//serviceType : Ext.get('serviceType-id').dom.value,
				noOfVlanProt : Ext.get('nniNoOfVlanALU-id').dom.value,
				PERouterVlanNoProt : nniVlanFreeOnRouterProt,//Ext.get('nniVlanFreeOnRouterProt-id').dom.value,
				PERouterAlias1Prot :  routerHostAliasProt,
				PERouterLogicalNameProt : nniIpBearerPortNameProt,//Ext.get('nniIpBearerPortNameProt-id').dom.value,
				ROUTER_PEMGMTIPProt : routerHostIpAddressProt,
				PESwitchAlias1Prot : switchToCloudHostNameProt,//Ext.get('switchToCloudHostNameProt-id').dom.value,
				PESwitchLogicalName_HoffProt : switchToCloudPortNameProt,//Ext.get('switchToCloudPortNameProt-id').dom.value,
				SWITCH_PEMGMTIPProt : switchIpAddressProt,//Ext.get('switchIpAddressProt-id').dom.value
				routerUplinkPortProt: portIdProt

			},
			method: 'POST',
			success: function ( result, request ) { 
				var jsonData = Ext.util.JSON.decode(result.responseText);

				if(result.responseText == "true"){
					//													Ext.MessageBox.alert('Success', 'Circuit Created........',function() {
					//														checkCircuitStatus();
					//       													window.location= redirectUrl;
					//													}); 	
					Ext.MessageBox.show({	        		
						title: 'Please wait',
						msg: 'Circuit Creation Started........',
						width:300,
						closable:false
					});
					setTimeout("checkNNIALUCircuitStatus()",3000);
				}else if (result.responseText == "error"){

					Ext.MessageBox.alert('failed', 'Data not proper.Check topology',function() {									
						window.location= redirectUrl;		
					});	
				}else{

					Ext.MessageBox.alert('failed', 'Circuit Creation Failed',function() {									
						window.location= redirectUrl;		
					});	
				}											
			},
			failure: function ( result, request) { 
				Ext.MessageBox.alert('failed', 'Circuit Creation Failed'); 

			}			
			});		            
			//								}else{
			//						        	Ext.MessageBox.alert('failed','Some Fields are blank');
			//						       }   
		}
		},allocateIpButton_NNIALU,
		{
			text: 'Cancel',
			handler: function(){
			nniALUForm.getForm().reset();
			nniForALUWin.hide();
		} 
		}]
	});
})