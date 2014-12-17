var allocateIpButton_NNI = new Ext.Button(
{
	text: 'Allocate IP',
	id: 'Allocate_IP',
    disabled : true,
    handler: function(){
		IllorGvpnIpAutomation(nniWin);
	}
});
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

	function vlanNameGenerationNNI() {
		var strArray = '';
		var vlanValue = '';
		var strValues = 0;
		var num = '';
		var content = '';
		var index = 0;
		num = Ext.getCmp('nniNoOfVlan-id').getValue();
		content = Ext.getCmp('nniVlanFreeOnRouter-id').getValue();
		strArray = content.split(",");
		for ( var j = 0; j < strArray.length; j++) {
			if (strArray[j] != '' && strArray[j] != null) {
				strValues++;
			}
		}
		if (Ext.getCmp('specialQosLoopingReqdNni-id').checked == false && isDotInterface == false) {
			interfaceName = "Vlan";
		} else if(Ext.getCmp('specialQosLoopingReqdNni-id').checked == true || isDotInterface == true){
			if(portNameQos=='' || portNameQos==null){
				if (typeOfNode == "ROUTER") {
				if (isDotInterface == true) {
					var namePort = Ext.getCmp('routerToCloudPortName-id').getValue();
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
					&& Ext.getCmp('nniVlanFreeOnRouter-id').getValue() != "0"
					&& Ext.getCmp('nniVlanFreeOnRouter-id').getValue() != ""){
				Ext.MessageBox.alert('Result', "Looping Port Not Found. Unchecking QoS Loop checkbox.");
				Ext.getCmp('nniIpBearerPortName-id').setValue("");
				Ext.getCmp('specialQosLoopingReqdNni-id').setValue("0");
				vlanNameGenerationNNI();
				return;
			}
		}
		if (num < strValues) {
			alert("You have to enter " + num + " Vlan numbers Only");
			for ( var j = 0; j < num; j++) {
				vlanValue = vlanValue + interfaceName + strArray[j] + ",";
			}
			index = content.lastIndexOf(strArray[num]);
			Ext.getCmp('nniVlanFreeOnRouter-id').setValue(
					content.substring(0, index - 1));
			ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
			Ext.getCmp('nniIpBearerPortName-id').setValue(ipBearerPortName);
		} else if (num == strValues) {
			for ( var i = 0; i < num; i++) {
				vlanValue = vlanValue + interfaceName + strArray[i] + ",";
			}
			ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
			Ext.getCmp('nniIpBearerPortName-id').setValue(ipBearerPortName);
		} else if (num > strValues) {
			alert("You have to enter lesser Vlan numbers ");
			Ext.getCmp('nniVlanFreeOnRouter-id').setValue("");
			Ext.getCmp('nniIpBearerPortName-id').setValue("");
		}
	};
		function vlanNameGenerationNNIProt() {
		var strArray = '';
		var vlanValue = '';
		var strValues = 0;
		var num = '';
		var content = '';
		var index = 0;
		num = Ext.getCmp('nniNoOfVlanProt-id').getValue();
		content = Ext.getCmp('nniVlanFreeOnRouterProt-id').getValue();
		strArray = content.split(",");
		for ( var j = 0; j < strArray.length; j++) {
			if (strArray[j] != '' && strArray[j] != null) {
				strValues++;
			}
		}
		if (Ext.getCmp('specialQosLoopingReqdNniProt-id').checked == false && isDotInterfaceProt == false) {
			interfaceNameProt = "Vlan";
		} else if(Ext.getCmp('specialQosLoopingReqdNniProt-id').checked == true || isDotInterfaceProt == true){
			if(portNameQosProt == '' || portNameQosProt == null){
				if (typeOfNodeProt == "ROUTER") {
					if (isDotInterfaceProt == true) {
						var namePort = Ext.getCmp('routerToCloudPortName-id').getValue();
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
					&& Ext.getCmp('nniVlanFreeOnRouterProt-id').getValue() != "0"
					&& Ext.getCmp('nniVlanFreeOnRouterProt-id').getValue() != ""){
				Ext.MessageBox.alert('Result', "Looping Port Not Found. Unchecking QoS Loop checkbox.");
				Ext.getCmp('nniIpBearerPortNameProt-id').setValue("");
				Ext.getCmp('specialQosLoopingReqdNniProt-id').setValue("0");
				vlanNameGenerationNNI();
				return;
			}
		}
		if (num < strValues) {
			alert("You have to enter " + num + " Vlan numbers Only");
			for ( var j = 0; j < num; j++) {
				vlanValue = vlanValue + interfaceNameProt + strArray[j] + ",";
			}
			index = content.lastIndexOf(strArray[num]);
			Ext.getCmp('nniVlanFreeOnRouterProt-id').setValue(
					content.substring(0, index - 1));
			ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
			Ext.getCmp('nniIpBearerPortNameProt-id').setValue(ipBearerPortNameProt);
		} else if (num == strValues) {
			for ( var i = 0; i < num; i++) {
				vlanValue = vlanValue + interfaceNameProt + strArray[i] + ",";
			}
			ipBearerPortNameProt = vlanValue.substring(0, vlanValue.length - 1);
			Ext.getCmp('nniIpBearerPortNameProt-id').setValue(ipBearerPortNameProt);
		} else if (num > strValues) {
			alert("You have to enter lesser Vlan numbers ");
			Ext.getCmp('nniVlanFreeOnRouterProt-id').setValue("");
			Ext.getCmp('nniIpBearerPortNameProt-id').setValue("");
		}
	};
	function getIpBearerPortNameQosNni(){
				
			Ext.Ajax.request({
				url : '../Nni.cnms' , 
				params : { method : 'getIpBearerPortNameQos',
						  data1: routerHostAlias//Ext.get('nniRouterHostName-id').dom.value 
						 },
				method: 'POST',
				success: function ( result, request ) { 
							var jsonData = Ext.util.JSON.decode(result.responseText);
							portNameQos = jsonData.IPBEARERPORTNAME;
							vlanNameGenerationNNI();
							if(portNameQos == undefined){
								Ext.getCmp('nniIpBearerPortName-id').setValue("");
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
				url : '../Nni.cnms' , 
				params : { method : 'getIpBearerPortNameQos',
						  data1: routerHostAliasProt//Ext.get('nniRouterHostName-id').dom.value 
						 },
				method: 'POST',
				success: function ( result, request ) { 
							var jsonData = Ext.util.JSON.decode(result.responseText);
							portNameQosProt = jsonData.IPBEARERPORTNAME;
							vlanNameGenerationNNIProt();
							if(portNameQosProt == undefined){
								Ext.getCmp('nniIpBearerPortNameProt-id').setValue("");
								Ext.MessageBox.alert('Failed', 'Ethernet Bearer Loop not present. Please uncheck QoS Looping');
							}
				},
				failure: function ( result, request) { 
					Ext.MessageBox.alert('Failed', result.responseText); 
				}
			});
	}

	var nniForm = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        labelWidth: 190,
        frame:true,
        autoHeight: true,
        listeners:{
		 	afterrender : function(){
		 		NNICPENodeStore.on('load',function(){
		 			Ext.getCmp('NNICPEName-id').setValue("1900000180");
		 		});
		 		NNICPENodeStore.load();
		 	}
		},
        items: [
		{
    			 xtype : 'checkbox',
    			 fieldLabel: 'Special QOS Looping Required',
				 id: 'specialQosLoopingReqdNni-id',
				 listeners:{
				 	check : function(){
				 		
				 		if(Ext.getCmp('specialQosLoopingReqdNni-id').checked == true
				 			&& Ext.get('nniRouterHostName-id').getValue() != '' ){ //Special QOS Looping Data
				 			getIpBearerPortNameQosNni();

						}else {
							if(topologyType == 'LINEAR'  && Ext.get('nniRouterHostName-id').getValue() != ''){
							portNameQos = portName;
							}
							getIpBearerPortNameQosNni();
						}
					}
				 }
        	}, {
		        xtype: 'textfield',
	            fieldLabel: 'NNI ID',
	            id: 'NNI_ID',
				name: 'nni_id_name',
	            anchor:'95%',  
	            listeners: {
            	change: function(){
        				nniForm.getEl().mask('Fetching NNI Details..');
            			Ext.Ajax.request({
									url : '../Nni.cnms' , 
									params : { method : 'getSwitchDetails',
											  data1: Ext.get('NNI_ID').dom.value,
											  uniqueNniId: uniqueProcessId },
									method: 'POST',
									success: function ( result, request ) { 
												var jsonData = Ext.util.JSON.decode(result.responseText);
												
												Ext.getCmp('cloud-id').setValue(jsonData.cloudName);
												
												cloudID = jsonData.cloudId;	
												eBBtwSwitchToCloud = jsonData.eBBtwSwitchToCloud;	
												Ext.getCmp('cloudPortId-id').setValue(jsonData.cloudPortId);
												Ext.getCmp('cloudPortAlias1-id').setValue(jsonData.cloudPortAlias1);
												typeOfNode = jsonData.typeOfNode;
																										
												node2location = jsonData.node2location;
												alias1 = jsonData.alias1;
												if(jsonData.typeOfNode == "ROUTER"){
													
													Ext.getCmp('switchToCloudHostName-id').disable();
													Ext.getCmp('switchIpAddress-id').disable();
													Ext.getCmp('nniRouterHostName-id').disable();
													Ext.getCmp('nniRouterIpAddress-id').disable();
													Ext.getCmp('switchToCloudPortName-id').disable();
													
													Ext.getCmp('routerToCloudHostName-id').setValue(jsonData.routerToCloudHostName);
													Ext.getCmp('routerToCloudPortName-id').setValue(jsonData.zEndPortForCloud);
													
													routerHostName = jsonData.zEndNodeForCloudId; //Ext.getCmp('routerToCloudHostName-id').getValue();
													routerHostAlias = Ext.get('routerToCloudHostName-id').dom.value;
													routerHostIpAddress = jsonData.zEndNodeForCloudNameIpAddr;
													Ext.getCmp('routerConnectedToCloudIpAddress-id').setValue(jsonData.zEndNodeForCloudNameIpAddr);
													zEndPortForCloud = jsonData.zEndPortForCloud;
													
													Ext.getCmp('routerToCloudHostName-id').focus();
													Ext.MessageBox.alert('Result', " Cloud Is Attached To Router Directly");
													
													if(alias1 == "DOTINTERFACE"){
														isDotInterface = true;
													}
												
												}else if(jsonData.typeOfNode == "SWITCH"){
													
													Ext.getCmp('routerToCloudHostName-id').disable();
													Ext.getCmp('routerConnectedToCloudIpAddress-id').disable();
													Ext.getCmp('routerToCloudPortName-id').disable();
													Ext.getCmp('switchToCloudHostName-id').setValue(jsonData.switchToCloudHostName);
													Ext.getCmp('switchToCloudPortName-id').setValue(jsonData.zEndPortForCloud);
													Ext.getCmp('switchIpAddress-id').setValue(jsonData.zEndNodeForCloudNameIpAddr);
													Ext.getCmp('switchToCloudHostId-id').setValue(jsonData.zEndNodeForCloudId);
													
													topologyTableName = jsonData.topologyTableName;
													
													nniRouterHostNameStore.setBaseParam('tableName',topologyTableName);
													nniRouterHostNameStore.load();
												}else if(jsonData.error == "InvalidNNI"){
													Ext.MessageBox.alert('Result', "Provided NNI-ID is not a Valid Service or IOR Name");	
												}else if(jsonData.error == "NonCloud"){
													Ext.MessageBox.alert('Result', "Neither End is of Type Cloud");	
												}
												isNNIProtectionCase = false;
												
												if(jsonData.iorName_Prot != undefined){// If Dual NNI case
													isNNIProtectionCase = true;
													
													iorNameProt = jsonData.iorName_Prot;
													Ext.getCmp('nniProtectionDetails-id').show();
																												
													Ext.getCmp('cloudProt-id').setValue(jsonData.cloudName_Prot);
												
													cloudIDProt = jsonData.cloudId_Prot;	
													eBBtwSwitchToCloudProt = jsonData.eBBtwSwitchToCloud_Prot;	
													Ext.getCmp('cloudPortIdProt-id').setValue(jsonData.cloudPortId_Prot);
													Ext.getCmp('cloudPortAlias1Prot-id').setValue(jsonData.cloudPortAlias1_Prot);
													typeOfNodeProt = jsonData.typeOfNode_Prot;
													
													Ext.getCmp('NNI_IDProt').setValue(jsonData.iorName_Prot);
													
													node2locationProt = jsonData.node2location_Prot;
													alias1Prot = jsonData.alias1_Prot;
													if(jsonData.typeOfNode_Prot == "ROUTER"){
														
														Ext.getCmp('switchToCloudHostNameProt-id').disable();
														Ext.getCmp('switchIpAddressProt-id').disable();
														Ext.getCmp('nniRouterHostNameProt-id').disable();
														Ext.getCmp('nniRouterIpAddressProt-id').disable();
														Ext.getCmp('switchToCloudPortNameProt-id').disable();
														
														Ext.getCmp('routerToCloudHostNameProt-id').setValue(jsonData.routerToCloudHostName_Prot);
														Ext.getCmp('routerToCloudPortNameProt-id').setValue(jsonData.zEndPortForCloud_Prot);
														
														routerHostNameProt = jsonData.zEndNodeForCloudId_Prot; //Ext.getCmp('routerToCloudHostName-id').getValue();
														routerHostAliasProt = Ext.get('routerToCloudHostNameProt-id').dom.value;
														routerHostIpAddressProt = jsonData.zEndNodeForCloudNameIpAddr_Prot;
														Ext.getCmp('routerConnectedToCloudIpAddressProt-id').setValue(jsonData.zEndNodeForCloudNameIpAddr_Prot);
														zEndPortForCloudProt = jsonData.zEndPortForCloud_Prot;
														
														if(alias1Prot == "DOTINTERFACE"){
															isDotInterfaceProt = true;
														}
													
													}else if(jsonData.typeOfNode_Prot == "SWITCH"){
														
														Ext.getCmp('routerToCloudHostNameProt-id').disable();
														Ext.getCmp('routerConnectedToCloudIpAddressProt-id').disable();
														Ext.getCmp('routerToCloudPortNameProt-id').disable();
														Ext.getCmp('switchToCloudHostNameProt-id').setValue(jsonData.switchToCloudHostName_Prot);
														Ext.getCmp('switchToCloudPortNameProt-id').setValue(jsonData.zEndPortForCloud_Prot);
														Ext.getCmp('switchIpAddressProt-id').setValue(jsonData.zEndNodeForCloudNameIpAddr_Prot);
														Ext.getCmp('switchToCloudHostIdProt-id').setValue(jsonData.zEndNodeForCloudId_Prot);
														
														topologyTableNameProt = jsonData.topologyTableName_Prot;
														
														nniRouterHostNameStoreProt.setBaseParam('tableName',topologyTableNameProt);
														nniRouterHostNameStoreProt.load();
													}else if(jsonData.error_Prot == "InvalidNNI"){
														Ext.MessageBox.alert('Result', "Protected NNI-ID is not a Valid Service or IOR Name");	
													}else if(jsonData.error_Prot == "NonCloud"){
														Ext.MessageBox.alert('Result', "Neither End is of Type Cloud for Protection IOR");	
													}
												}else{
													Ext.getCmp('nniProtectionDetails-id').hide();
												}															
												nniForm.getEl().unmask();	
									},
									failure: function ( result, request) { 
												Ext.MessageBox.alert('Failed', result.responseText); 
									}
								});
            		}
           		 }
       	 },{       	 
       	 		xtype: 'textfield',
	            id: 'switchToCloudHostId-id',
				name: 'switchToCloudHostId',
	            anchor:'95%',
	            hidden : true       	 
       	 },{       	 
       	 		xtype: 'textfield',
	            fieldLabel: 'Switch Connected To Cloud',
	            id: 'switchToCloudHostName-id',
				name: 'switchToCloudHostName',
	            anchor:'95%'        	 
       	 },{       	 
       	 		xtype: 'textfield',
	            fieldLabel: 'Switch Port Name',
	            id: 'switchToCloudPortName-id',
				name: 'switchToCloudPortName',
	            anchor:'95%'       	 
       	 },{       	 
       	 		xtype: 'textfield',
	            fieldLabel: 'Switch IP Address',
	            id: 'switchIpAddress-id',
				name: 'switchIpAddress',
	            anchor:'95%'        	 
       	 },{
		        xtype: 'textfield',	            
	            id: 'NNIBtsSwitchHostName-id',
				name: 'NNIBtsSwitchHostName',
	            anchor:'95%',
	            readOnly:true,
	            hidden : true,
	            listeners:{
            		change : function(){	            		
	            		switchName = Ext.get('NNIBtsSwitchHostName-id').getValue();
	            		wimaxSwitchPortNameStore.setBaseParam('switchname',switchName);
	            		wimaxSwitchPortNameStore.load();	
	            		// Call topology query and store data in mysql temp table
	            		Ext.Ajax.request({
								url : '../Wimax.cnms' , 
								params : { method : 'getTopologyDetailsWimax',
										   data1: Ext.get('NNIBtsSwitchHostName-id').dom.value 
										   },
								method: 'POST',
								success: function ( result, request ) { 
											var jsonData = Ext.util.JSON.decode(result.responseText);
											topologyTempTableName = jsonData.topologyTableName;
								},
								failure: function ( result, request) { 
									Ext.MessageBox.alert('Failed', result.responseText); 
								}
						});
            		}
            	}
          }
       	 ,{       	 
       	 		xtype: 'textfield',
	            fieldLabel: 'Router Connected To Cloud',
	            id: 'routerToCloudHostName-id',
				name: 'routerToCloudHostName',
	            anchor:'95%'  	 
       	 },{       	 
       	 		xtype: 'textfield',
	            fieldLabel: 'Router Port Name',
	            id: 'routerToCloudPortName-id',
				name: 'routerToCloudPortName',
	            anchor:'95%'      	 
       	 },{       	 
       	 		xtype: 'textfield',
	            fieldLabel: 'Router Connected To Cloud IP',
	            id: 'routerConnectedToCloudIpAddress-id',
				name: 'routerConnectedToCloudIpAddress',
	            anchor:'95%' 
       	 },{
       	 		xtype: 'textfield',
	            id: 'cloudPortId-id',
				name: 'cloudPortId',
	            anchor:'95%',
       	 		hidden : true       	 
       	 },{       	 
       	 		xtype: 'textfield',
	            id: 'cloudPortAlias1-id',
				name: 'cloudPortAlias1',
	            anchor:'95%', 
       	 		hidden : true       	 
       	 },{       	 
       	 		xtype: 'textfield',
	            fieldLabel: 'Cloud',
	            id: 'cloud-id',
				name: 'cloudName',
				allowBlank:false,
	            anchor:'95%' 	 
       	 },{
		        xtype: 'combo',
				fieldLabel: 'Router Host Name',
				id: 'nniRouterHostName-id',
				name: 'nniRouterHostName',
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
 					Ext.Ajax.request({
 							url : '../Nni.cnms' , 
							params : { method : 'getRouterHostDetails',
									   data1: Ext.getCmp('nniRouterHostName-id').getValue(),
									   data2 : topologyTableName },
							method: 'POST',
							success: function ( result, request ) { 
										var jsonData = Ext.util.JSON.decode(result.responseText);
										Ext.getCmp('nniRouterIpAddress-id').setValue(jsonData.routerHostIpAddress);
										topologyType = jsonData.topologyType;
										
										routerHostName = Ext.getCmp('nniRouterHostName-id').getValue();
										routerHostAlias = Ext.get('nniRouterHostName-id').dom.value;
										routerHostIpAddress = Ext.get('nniRouterIpAddress-id').dom.value;
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
 				} 				
 			}
          }	,{
				xtype: 'textfield',
				fieldLabel: 'Router IP Address',
				id: 'nniRouterIpAddress-id',
				name: 'nniRouterIpAddress',
				readOnly:true,
				anchor:'95%'  			
		},{
				xtype : 'numberfield',
				fieldLabel : 'No of Vlan',
				id : 'nniNoOfVlan-id',
				name : 'nniNoOfVlan',
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
									Ext.getCmp('nniNoOfVlan-id').setValue("1");
									Ext.getDom('nniNoOfVlan-id').readOnly = true;
								}
							},
							failure : function(result, request)
							{
								Ext.MessageBox.alert('Failed',result.responseText);
							}
						});
					},
					change : function() {
						Ext.getCmp('nniVLANCategory-id').setValue("");
						Ext.getCmp('nniVlanFreeOnRouter-id').setValue("");
						Ext.getCmp('nniIpBearerPortName-id').setValue("");
					}

				}
		},{
				xtype:'combo',
				fieldLabel:'VLAN Category',
				id:'nniVLANCategory-id',
				name:'nniVLANCategory',                
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
						if(Ext.getCmp('routerToCloudHostName-id').getValue() == "" ||  Ext.getCmp('routerToCloudHostName-id').getValue() == null){
							routerName = Ext.get('nniRouterHostName-id').dom.value;
						}else{
							routerName = Ext.getCmp('routerToCloudHostName-id').getValue();
						}
						Ext.Ajax.request({
							url : '../EthWithTxWTopo.cnms' , 
							params : { method : 'getVlanNumber',
									   category: Ext.getCmp('nniVLANCategory-id').getValue(),
									   noofVlan : Ext.getCmp('nniNoOfVlan-id').getValue(),
									   router : routerName },
							method: 'POST',
							success: function ( result, request ) { 
										var jsonData = Ext.util.JSON.decode(result.responseText);
										vlanNo = jsonData.VLANNO;
										if(vlanNo == "No Free VLAN No. available."){
											vlanNo = 0;
											alert("No Free VLAN Number available");
										}
										Ext.getCmp('nniVlanFreeOnRouter-id').setValue(vlanNo);
										vlanNameGenerationNNI();

							},
							failure: function ( result, request) { 
								Ext.MessageBox.alert('Failed', result.responseText); 
							}
						});
					}
				}
        	},{
				xtype: 'textfield',
				fieldLabel: 'VLAN Free On Router',
				id: 'nniVlanFreeOnRouter-id',
				name: 'nniVlanFreeOnRouter',
				anchor:'95%', 
				readOnly:false,
				allowBlank: false,
				listeners: {
					blur : function(){
						vlanNameGenerationNNI();
					}
				}
		},{
			xtype: 'checkbox',
			name: 'nniVLANAssociatedtoServiceID',
			id: 'nniVLANAssociatedtoServiceID-id',
			fieldLabel: 'VLAN already reserved',
			listeners:{
			 	check : function()
			 	{
					if(Ext.getCmp('nniVLANAssociatedtoServiceID-id').checked == true){
						Ext.getCmp('reserveNNI').disable();
						Ext.getCmp('createCircuitNNI-id').enable();								
					}
					if(Ext.getCmp('nniVLANAssociatedtoServiceID-id').checked == false){
						Ext.getCmp('createCircuitNNI-id').disable();
						Ext.getCmp('reserveNNI').enable();
					}
				}
			  }			
		},{
			xtype: 'textfield',
			fieldLabel: 'IP Bearer Port Name',
			id: 'nniIpBearerPortName-id',
			name: 'nniIpBearerPortName',
			allowBlank: false,
			readOnly:true,
			anchor:'95%'  		
		},{
	   		defaults:{xtype:'fieldset', layout:'form', anchor:'100%', autoHeight:true},
	   		baseCls: 'x-plain',
	   		id: 'nniProtectionDetails-id',
	   		hidden: true,
  	 		items:
  	 		[{
	    		title:'NNI Protection Details',
	    		id: 'NNIFields-id',
	    		items:
	    	 	{
					id:'fs2col-form',
					layout:'form',
					baseCls: 'x-plain',
					frame:false,
	 				defaults:
	 				{
  	 			
  	 					baseCls: 'x-plain',
						layout:'form',
						hideLabels:false,
						border:false
					},
					items:
					[{
				    	defaults:{xtype:'fieldset', layout:'form', anchor:'100%', autoHeight:true},
			    	  	items:
			    	  	[{
		        			 xtype : 'checkbox',
		        			 fieldLabel: 'Special QOS Looping Required',
							 id: 'specialQosLoopingReqdNniProt-id',
							 hiddenValue: '',
							 listeners:{
							 	check : function(){									 		
		 					 		if(Ext.getCmp('specialQosLoopingReqdNniProt-id').checked == true){ //Special QOS Looping Data 
										getIpBearerPortNameQosNniProt();						
									}	
									if(typeOfNodeProt == "ROUTER")
									{
										if(isDotInterfaceProt == false){													
											if(Ext.getCmp('specialQosLoopingReqdNniProt-id').checked == false){															
													ipBearerPortNameProt = "Vlan"+Ext.get('nniVlanFreeOnRouterProt-id').getValue();
													Ext.getCmp('nniIpBearerPortNameProt-id').setValue(ipBearerPortNameProt);															
											}
										}else{
											
											var namePort = Ext.getCmp('routerToCloudPortNameProt-id').getValue();
											ipBearerPortNameProt = namePort+"."+ Ext.getCmp('nniVlanFreeOnRouterProt-id').getValue();
											Ext.getCmp('nniIpBearerPortNameProt-id').setValue(ipBearerPortNameProt);
										}
									}
									else if (typeOfNodeProt == "SWITCH"){
										if(topologyType == 'RING' && Ext.getCmp('specialQosLoopingReqdNniProt-id').checked == false){													
											ipBearerPortNameProt = "Vlan"+Ext.get('nniVlanFreeOnRouterProt-id').getValue();
											Ext.getCmp('nniIpBearerPortNameProt-id').setValue(ipBearerPortNameProt);														
										}																			 
										if(topologyType == 'LINEAR' && Ext.getCmp('specialQosLoopingReqdNniProt-id').checked == false){
											ipBearerPortNameProt = portNameProt+"."+ Ext.getCmp('nniVlanFreeOnRouterProt-id').getValue();
											Ext.getCmp('nniIpBearerPortNameProt-id').setValue(ipBearerPortNameProt);
										}
									}
								}
							 }
				         },{
						        xtype: 'textfield',
					            fieldLabel: 'NNI ID',
					            id: 'NNI_IDProt',
								name: 'nni_id_nameProt',
								hiddenValue: '',
					            anchor:'95%'
				       	 },{							       	 
				       	 		xtype: 'textfield',
					            id: 'switchToCloudHostIdProt-id',
								name: 'switchToCloudHostIdProt',
								hiddenValue: '',
					            anchor:'95%',
					            hidden : true							       	 
				       	 },{							       	 
				       	 		xtype: 'textfield',
					            fieldLabel: 'Switch Connected To Cloud',
					            id: 'switchToCloudHostNameProt-id',
								name: 'switchToCloudHostNameProt',
								hiddenValue: '',
					            anchor:'95%' 
				       	 },{							       	 
				       	 		xtype: 'textfield',
					            fieldLabel: 'Switch Port Name',
					            id: 'switchToCloudPortNameProt-id',
								name: 'switchToCloudPortName',
								hiddenValue: '',
					            anchor:'95%' 							       	 
				       	 },{							       	 
				       	 		xtype: 'textfield',
					            fieldLabel: 'Switch IP Address',
					            id: 'switchIpAddressProt-id',
								name: 'switchIpAddress',
								hiddenValue: '',
					            anchor:'95%' 
				       	 },{
						        xtype: 'textfield',	            
					            id: 'NNIBtsSwitchHostNameProt-id',
								name: 'NNIBtsSwitchHostNameProt',
								hiddenValue: '',
					            anchor:'95%',
					            readOnly:true,
					            hidden : true,
					            listeners:{
					            		change : function(){
					            		
						            		switchName = Ext.get('NNIBtsSwitchHostNameProt-id').getValue();
						            		wimaxSwitchPortNameStore.setBaseParam('switchname',switchName);
						            		wimaxSwitchPortNameStore.load();	
						            		// Call topology query and store data in mysql temp table
						            		Ext.Ajax.request({
														url : '../Wimax.cnms' , 
														params : { method : 'getTopologyDetailsWimax',
																   data1: Ext.get('NNIBtsSwitchHostNameProt-id').dom.value //,
																   //data2 : btsSwitchId 
																   },
														method: 'POST',
														success: function ( result, request ) { 
																	var jsonData = Ext.util.JSON.decode(result.responseText);
																	topologyTempTableNameProt = jsonData.topologyTableName_Prot;
														},
														failure: function ( result, request) { 
															Ext.MessageBox.alert('Failed', result.responseText); 
														}
											});
					            	}
				            	}
				          }
				       	 ,{							       	 
				       	 		xtype: 'textfield',
					            fieldLabel: 'Router Connected To Cloud',
					            id: 'routerToCloudHostNameProt-id',
								name: 'routerToCloudHostNameProt',
								hiddenValue: '',
					            anchor:'95%' 
				       	 },{							       	 
				       	 		xtype: 'textfield',
					            fieldLabel: 'Router Port Name',
					            id: 'routerToCloudPortNameProt-id',
								name: 'routerToCloudPortNameProt',
								hiddenValue: '',
					            anchor:'95%' 
				       	 },{							       	 
				       	 		xtype: 'textfield',
					            fieldLabel: 'Router Connected To Cloud IP',
					            id: 'routerConnectedToCloudIpAddressProt-id',
								name: 'routerConnectedToCloudIpAddressProt',
								hiddenValue: '',
					            anchor:'95%' 
				       	 },{
				       	 		xtype: 'textfield',
					            id: 'cloudPortIdProt-id',
								name: 'cloudPortIdProt',
					            anchor:'95%',
					            hiddenValue: '',
				       	 		hidden : true							       	 
				       	 },{							       	 
				       	 		xtype: 'textfield',
					            id: 'cloudPortAlias1Prot-id',
								name: 'cloudPortAlias1Prot',
								hiddenValue: '',
					            anchor:'95%', 
				       	 		hidden : true							       	 
				       	 },{							       	 
				       	 		xtype: 'textfield',
					            fieldLabel: 'Cloud',
					            id: 'cloudProt-id',
								name: 'cloudNameProt',
								allowBlank:false,
								hiddenValue: '',
					            anchor:'95%'        	 
				       	 },{
						        xtype: 'combo',
								fieldLabel: 'Router Host Name',
								id: 'nniRouterHostNameProt-id',
								name: 'nniRouterHostNameProt',
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
				 					Ext.Ajax.request({
 											url : '../Nni.cnms' , 
											params : { method : 'getRouterHostDetails',
													   data1: Ext.getCmp('nniRouterHostNameProt-id').getValue(),
													   data2 : topologyTableNameProt },
											method: 'POST',
											success: function ( result, request ) { 
														var jsonData = Ext.util.JSON.decode(result.responseText);
														Ext.getCmp('nniRouterIpAddressProt-id').setValue(jsonData.routerHostIpAddress);
														topologyTypeProt = jsonData.topologyType;
														
														routerHostNameProt = Ext.getCmp('nniRouterHostNameProt-id').getValue();
														routerHostAliasProt = Ext.get('nniRouterHostNameProt-id').dom.value;
														routerHostIpAddressProt = Ext.get('nniRouterIpAddressProt-id').dom.value;
														if(topologyTypeProt == 'LINEAR' && Ext.getCmp('specialQosLoopingReqdNniProt-id').checked == true){
							
															Ext.MessageBox.alert('Result', "Looping Not Applicable For Linear Topology"); 
							
														}else if(topologyTypeProt =='LINEAR' && Ext.getCmp('specialQosLoopingReqdNniProt-id').checked == false){
															portNameProt= jsonData.portName;
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
								id: 'nniRouterIpAddressProt-id',
								name: 'nniRouterIpAddressProt',
								readOnly:true,
								hiddenValue: '',
								anchor:'95%'  										
						},{
									xtype : 'numberfield',
									fieldLabel : 'No of Vlan',
									id : 'nniNoOfVlanProt-id',
									name : 'nniNoOfVlanProt',
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
														Ext.getCmp('nniNoOfVlanProt-id').setValue("1");
														Ext.getDom('nniNoOfVlanProt-id').readOnly = true;
													}
												},
												failure : function(result, request)
												{
													Ext.MessageBox.alert('Failed',result.responseText);
												}
											});
										},
										change : function() {
											Ext.getCmp('nniVLANCategoryProt-id').setValue("");
											Ext.getCmp('nniVlanFreeOnRouterProt-id').setValue("");
											Ext.getCmp('nniIpBearerPortNameProt-id').setValue("");
										}

									}
						},{
								xtype:'combo',
								fieldLabel:'VLAN Category',
								id:'nniVLANCategoryProt-id',
								name:'nniVLANCategoryProt',                
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
										if(Ext.getCmp('routerToCloudHostNameProt-id').getValue() == "" ||  Ext.getCmp('routerToCloudHostNameProt-id').getValue() == null){
											routerNameProt = Ext.get('nniRouterHostNameProt-id').dom.value;
										}else{
											routerNameProt = Ext.getCmp('routerToCloudHostNameProt-id').getValue();
										}
										Ext.Ajax.request({
											url : '../EthWithTxWTopo.cnms' , 
											params : { method : 'getVlanNumber',
													   category: Ext.getCmp('nniVLANCategoryProt-id').getValue(),
													   noofVlan : Ext.getCmp('nniNoOfVlanProt-id').getValue(),
													   router : routerNameProt },
											method: 'POST',
											success: function ( result, request ) { 
														var jsonData = Ext.util.JSON.decode(result.responseText);
														vlanNo = jsonData.VLANNO;
														if(vlanNo == "No Free VLAN No. available."){
															vlanNo = 0;
															alert("No Free VLAN Number available");
														}
														Ext.getCmp('nniVlanFreeOnRouterProt-id').setValue(vlanNo);
														vlanNameGenerationNNIProt();
											},
											failure: function ( result, request) { 
												Ext.MessageBox.alert('Failed', result.responseText); 
											}
										});
									}
								}
				        	},{
								xtype: 'textfield',
								fieldLabel: 'VLAN Free On Router',
								id: 'nniVlanFreeOnRouterProt-id',
								name: 'nniVlanFreeOnRouterProt',
								anchor:'95%', 
								readOnly:false,
								allowBlank: false,
								hiddenValue: '',
								listeners: {
									blur : function(){
										vlanNameGenerationNNI();
								}
							}
						},
						{
							xtype: 'textfield',
							fieldLabel: 'IP Bearer Port Name',
							id: 'nniIpBearerPortNameProt-id',
							name: 'nniIpBearerPortNameProt',
							hiddenValue: '',
							defaultValue: '',
							readOnly:true,
							allowBlank: false,
							anchor:'95%'  
						}// END of Protection form
				    	]
			    	}]
		    	 
 				}
  	 		}]  	 					
 	 	},{
			xtype :'combo',
			fieldLabel :'CPE Node',
			id :'NNICPEName-id',
			name :'NNICPEName',
			triggerAction :'all',				
			anchor :'95%',
			minChars: 0 ,
			allowBlank :false,
			store :NNICPENodeStore,
			displayField :'combovalue',
			valueField :'comboid'			
		},{
			xtype: 'textfield',
			id: 'NNICPEIP-id',
			name: 'NNICPEIP',
			disabled : true,
			anchor:'95%',  
			hidden : true,
			value : 'Reserved for future use'
		}          
		]
    });

nniWin = new Ext.Window({
				        title: 'NNI',
				        width: 480,
				        maxHeight:1500,
				        x: 500,
				        y: 100,
				        plain:true,
				        bodyStyle:'padding:5px;',
				        buttonAlign:'center',
				        closable: false,
				        layout: 'fit',
				        items: nniForm,
					
				        buttons: [{
				            text: 'Reserve VLAN',
				            id: 'reserveNNI',            
				            handler: function(){
				        		if (nniForm.getForm().isValid())
								{
				        	
						        	Ext.MessageBox.show({
						        		
						        		title: 'Please wait',
						 				msg: 'Reserving VLAN...',
					                    width:300,
					                    closable:false,
					                    animEl: 'Reserve VLAN'
						            });		        	
							        if(Ext.get('nniVlanFreeOnRouterProt-id') == null){ nniVlanFreeOnRouterProt = ''; }
						        	else nniVlanFreeOnRouterProt = Ext.get('nniVlanFreeOnRouterProt-id').dom.value;
							        
						            Ext.Ajax.request({			
						            	url : '../EthWithTxWTopo.cnms' , 
											params : { method : 'reserveVLANNumber',
													   category: Ext.getCmp('nniVLANCategory-id').getValue(),
													   router : routerName,
													   routerName :Ext.getCmp('nniRouterHostName-id').getValue(),
													   vlanNumber :Ext.get('nniVlanFreeOnRouter-id').dom.value,
													   routerProt : routerNameProt,
													   vlanNumberProt :nniVlanFreeOnRouterProt,//Ext.get('nniVlanFreeOnRouterProt-id').dom.value,
													   serviceName : Ext.get('serviceId-id').dom.value,
													   uname : userName },
											method: 'POST',
											success: function ( result, request ) { 									
														var jsonData = Ext.util.JSON.decode(result.responseText);
														isVlanReserved = jsonData.RESERVED;
														if(isVlanReserved){
															Ext.MessageBox.alert("VLAN Reserved ");
															Ext.getCmp('createCircuitNNI-id').enable();											
														}
														else{
															Ext.MessageBox.alert("VLAN Reservation Failed ");											
															Ext.getCmp('createCircuitNNI-id').disable();
														}
											},
											failure: function ( result, request) { 
												Ext.MessageBox.alert('Failed', result.responseText); 
											}									
									});			
						        }else{
						        	Ext.MessageBox.alert('failed','Some Fields are blank');
						        }
				            }
				        },{
				            text: 'Create Circuit',
				            id: 'createCircuitNNI-id',
				            disabled: true,
				            handler: function(){
				        		if(nniForm.getForm().isValid()){
				        			Ext.MessageBox.show({

                                          title: 'Please wait',
 									      msg: 'Creating circuit...',
                                          width:300,
                                          closable:false,
                                         animEl: 'Create Circuit'
		                            });
						        	if(Ext.get('nniIpBearerPortNameProt-id') == null){ nniIpBearerPortNameProt = ''; }
						        	else nniIpBearerPortNameProt = Ext.get('nniIpBearerPortNameProt-id').dom.value;
						        	if(Ext.get('specialQosLoopingReqdNniProt-id') == null){ specialQosLoopingReqdNniProt = ''; }
						        	else specialQosLoopingReqdNniProt = Ext.getCmp('specialQosLoopingReqdNniProt-id').checked;
						        	if(Ext.get('switchToCloudHostIdProt-id') == null){ switchToCloudHostIdProt = ''; }
						        	else switchToCloudHostIdProt =  Ext.get('switchToCloudHostIdProt-id').dom.value;
						        	if(Ext.get('switchIpAddressProt-id') == null){ switchIpAddressProt = ''; }
						        	else switchIpAddressProt = Ext.get('switchIpAddressProt-id').dom.value;
						        	if(Ext.get('cloudProt-id') == null){ cloudProt = ''; }
						        	else cloudProt = Ext.get('cloudProt-id').dom.value;
						        	if(Ext.get('cloudPortAlias1Prot-id') == null){ cloudPortAlias1Prot = ''; }
						        	else cloudPortAlias1Prot = Ext.get('cloudPortAlias1Prot-id').dom.value;
						        	if(Ext.get('nniVlanFreeOnRouterProt-id') == null){ nniVlanFreeOnRouterProt = ''; }
						        	else nniVlanFreeOnRouterProt = Ext.get('nniVlanFreeOnRouterProt-id').dom.value;
						        	if(Ext.get('switchToCloudHostNameProt-id') == null){ switchToCloudHostNameProt = ''; }
						        	else switchToCloudHostNameProt =  Ext.get('switchToCloudHostNameProt-id').dom.value;
						        	if(Ext.get('switchToCloudPortNameProt-id') == null){ switchToCloudPortNameProt = ''; }
						        	else switchToCloudPortNameProt = Ext.get('switchToCloudPortNameProt-id').dom.value;
						        	if(Ext.get('switchIpAddressProt-id') == null){ switchIpAddressProt = ''; }
						        	else switchIpAddressProt = Ext.get('switchIpAddressProt-id').dom.value;
						        	
						            Ext.Ajax.request({			            			
				            				url : '../Nni.cnms' , 
											params : { method : 'createCircuitNni',
				            						   
				            						   data1 : circuitTableName,
													   serviceName : Ext.get('serviceId-id').dom.value,
													   customerName : Ext.getCmp('customerName-id').getValue(), 
													   peRouterLogicalName : Ext.get('nniIpBearerPortName-id').dom.value, 
													   cosReqd : Ext.getCmp('specialQosLoopingReqdNni-id').checked,
													   switchId : Ext.get('switchToCloudHostId-id').dom.value,
													   routerId : routerHostName,
													   routerHostAlias : routerHostAlias,
													   zEndPortForCloud : zEndPortForCloud,
													   btsIP : Ext.get('switchIpAddress-id').dom.value,
													   topologyTableName : topologyTableName,
													   ipBearerPortName	: ipBearerPortName,
													   ipPortType : IpPortType,
													   uname : userName,
													   portNameQos : portNameQos,
													   cloudAlias1 : Ext.get('cloud-id').dom.value,
													   cloudPortAlias1 : Ext.get('cloudPortAlias1-id').dom.value,
													   CPEDefId : Ext.getCmp('NNICPEName-id').value,
													   cpeIp : Ext.get('NNICPEIP-id').dom.value,
													   cloudId : cloudID,
													   node2location : node2location,
													   eBBtwSwitchToCloud : eBBtwSwitchToCloud,
													   typeOfNode : typeOfNode,
													   serviceType : Ext.get('serviceType-id').dom.value,
   													   noOfVlan : Ext.get('nniNoOfVlan-id').dom.value,
													   PERouterVlanNo : Ext.get('nniVlanFreeOnRouter-id').dom.value,
													   PERouterAlias1:  routerHostAlias,
													   PERouterLogicalName : Ext.get('nniIpBearerPortName-id').dom.value,
													   ROUTER_PEMGMTIP : routerHostIpAddress,
													   PESwitchAlias1 : Ext.get('switchToCloudHostName-id').dom.value,
													   PESwitchLogicalName_Hoff : Ext.get('switchToCloudPortName-id').dom.value,
													   SWITCH_PEMGMTIP : Ext.get('switchIpAddress-id').dom.value,
													   requestTrackingID:requestTrackingID,
													   uniqueNniId: uniqueProcessId,
													   
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
   													   noOfVlanProt : Ext.get('nniNoOfVlan-id').dom.value,
													   PERouterVlanNoProt : nniVlanFreeOnRouterProt,//Ext.get('nniVlanFreeOnRouterProt-id').dom.value,
													   PERouterAlias1Prot :  routerHostAliasProt,
													   PERouterLogicalNameProt : nniIpBearerPortNameProt,//Ext.get('nniIpBearerPortNameProt-id').dom.value,
													   ROUTER_PEMGMTIPProt : routerHostIpAddressProt,
													   PESwitchAlias1Prot : switchToCloudHostNameProt,//Ext.get('switchToCloudHostNameProt-id').dom.value,
													   PESwitchLogicalName_HoffProt : switchToCloudPortNameProt,//Ext.get('switchToCloudPortNameProt-id').dom.value,
													   SWITCH_PEMGMTIPProt : switchIpAddressProt//Ext.get('switchIpAddressProt-id').dom.value
													   
				            				 },
											method: 'POST',
											success: function ( result, request ) { 
												var jsonData = Ext.util.JSON.decode(result.responseText);

												if(result.responseText == "true"){
													Ext.MessageBox.show({	        		
										        		title: 'Please wait',
										 				msg: 'Circuit Creation Started........',
									                    width:300,
									                    closable:false
										            });
													setTimeout("checkCircuitStatus()",3000);
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
						       }else{
						        	Ext.MessageBox.alert('failed','Some Fields are blank');
						       }
				            }
				        },allocateIpButton_NNI,
				        {
				            text: 'Cancel',
				            handler: function(){
				            	nniForm.getForm().reset();
				            	nniWin.hide();
				            } 
				        }]
			    });
	})