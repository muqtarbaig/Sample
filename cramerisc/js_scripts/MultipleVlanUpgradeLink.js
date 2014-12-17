var serviceId;
var routerPort;
var check;
var multipleVlanUpgradeWinLink;
var multiVlanAllocateIpButton = new Ext.Button(
{
    text: 'Allocate IP',
    id: 'Allocate_IP',
    disabled : true,
    handler: function(){
		IllorGvpnIpAutomation(multipleVlanUpgradeWinLink);
	}
});
var ipBearerPortName = '';
var circuitTableName = '';
var requestTrackingID=Math.floor(Math.random()*99999999999);
var IpPortType =  'Primary';
var userName = document.hiddenFields.hiddenuserNameId.value;
var uniqueProcessId = document.hiddenFields.hiddenuniqueProcessId.value;

var serviceType='';
var nonISC = 'true';


function multiVlanCheckCircuit6Status(){

	Ext.Ajax.request({

		url : '../EthWOTxNOVlan.cnms' ,
		params : { method : 'checkCircuitCreationStatus',
				  requestTrackingID: requestTrackingID
				  },
		method: 'POST',
		success: function ( result, request ) {
					var jsonData = Ext.util.JSON.decode(result.responseText);
					if(jsonData.success == "true"){
						Ext.MessageBox.alert('Success', 'Circuit Creation Completed Successfully. IP Bearer/L2 Tunnel :'+jsonData.ipborl2tunnelname,function() {
  												//window.location= redirectUrl;
											});
						multiVlanAllocateIpButton.setDisabled(false);
						Ext.getCmp('createMultiVlan').disable();
					}else if(jsonData.result != " " && jsonData.result != "FAILED"){
						Ext.MessageBox.show({

			        		title: 'Please wait',
			 				msg:  jsonData.result,
		                    width:300,
		                    closable:false
			            });
						setTimeout("multiVlanCheckCircuit6Status()",5000);

					}else if(jsonData.result == "FAILED"){
						Ext.getCmp('createMultiVlan').disable();
						Ext.MessageBox.alert('Result', "Circuit Creation Failed");
					}
		}
	});
}
function multiVlanGetIpBearerPortName() {
	Ext.Ajax.request( {
			url : '../EthWOTxNOVlan.cnms',
		params : {
			method : 'getIpBearerPortNameQos',
			data1 : Ext.get('multiVlanRouterHostName-id').dom.value
		},
		method : 'POST',
		success : function(result, request) {
			var jsonData = Ext.util.JSON.decode(result.responseText);
			portNameQos = jsonData.IPBEARERPORTNAME;
			multiVlanNameGeneration();
		},
		failure : function(result, request) {
			Ext.MessageBox.alert('Failed', result.responseText);
		}
	});
};

function multiVlanNameGeneration(){
		var strArray = '';
		var vlanValue = '';
		var strValues = 0;
		var num = '';
		var content = '';
		var index=0;
		num = Ext.getCmp('multiVlanNoOfVlan-id').getValue();
		content = Ext.getCmp('multiVlanFreeOnRouter-id').getValue();
		strArray = content.split(",");
		for(var j=0;j<strArray.length;j++){
			if(strArray[j]!='' && strArray[j]!=null){
				strValues++;
			}
		}
		if(Ext.getCmp('multiVlanSpecialQosLoopingReq-id').checked == false){
			interfaceName = "Vlan";
		}else{
			//multiVlanGetIpBearerPortName();
			interfaceName = portNameQos+".";
			if(portNameQos == undefined 
					&& (Ext.getCmp('multiVlanFreeOnRouter-id').getValue() != "0"
					&& Ext.getCmp('multiVlanFreeOnRouter-id').getValue() != "")){
				Ext.MessageBox.alert('Result', "Looping Port Not Found. Unchecking QoS Loop checkbox.");
				Ext.getCmp('multiVlanIpBearerPortName-id').setValue("");
				Ext.getCmp('multiVlanSpecialQosLoopingReq-id').setValue("0");
				multiVlanNameGeneration();
				return;
			}
		}
		if(num < strValues)
		{
			alert("You have to enter "+num+" Vlan numbers Only");
			for(var j=0;j<num;j++){
				vlanValue = vlanValue+interfaceName+strArray[j]+",";
			}
			index = content.lastIndexOf(strArray[num]);
			Ext.getCmp('multiVlanFreeOnRouter-id').setValue(content.substring(0,index-1));
			ipBearerPortName = vlanValue.substring(0, vlanValue.length-1);
			Ext.getCmp('multiVlanIpBearerPortName-id').setValue(ipBearerPortName);
		}else if(num == strValues){
			for(var i=0;i<num;i++){
				vlanValue = vlanValue+interfaceName+strArray[i]+",";
			}
			ipBearerPortName = vlanValue.substring(0, vlanValue.length-1);
			Ext.getCmp('multiVlanIpBearerPortName-id').setValue(ipBearerPortName);
		}else if (num >strValues){
			alert("You have to enter lesser Vlan numbers ");
			Ext.getCmp('multiVlanFreeOnRouter-id').setValue("");
			Ext.getCmp('multiVlanIpBearerPortName-id').setValue("");
		}
};

function getNoOfVlanForServiceType(){
	Ext.Ajax.request
	(
		{
		url : '../EthWithTxWTopo.cnms',
		params :
		{
			method : 'checkForMultipleVlanServices',
			serviceType: serviceType
		},
		method : 'POST',
		success : function(result, request)
		{
			var jsonData = Ext.util.JSON.decode(result.responseText);
			result = jsonData.result;
			if (result == "false")
			{
				Ext.getCmp('multiVlanNoOfVlan-id').setValue("1");
				Ext.getDom('multiVlanNoOfVlan-id').readOnly = true;
			}else{
				Ext.getCmp('multiVlanNoOfVlan-id').setValue("");
				Ext.getDom('multiVlanNoOfVlan-id').readOnly = false;
			}
		},
		failure : function(result, request)
		{
			Ext.MessageBox.alert('Failed',result.responseText);
		}
	});
}

Ext.onReady(function(){

    Ext.QuickTips.init();

    Ext.form.Field.prototype.msgTarget = 'side';

    Ext.BLANK_IMAGE_URL = 'resources/images/default/s.gif';

	Ext.Ajax.timeout = 9000000;

	var reserveVlan = 'false';
	var routerNodeId = '';
	var routerPortId = '';
	var cpePortId = '';
	var cpeNodeId = '';
	var vlanCircuitId = '';
									 
	var multiVlanServiceNameStore = new Ext.data.JsonStore({
		
		url:'../GetComboJson.cnms',
		baseParams:{comboId:'GetAllServices'},
		fields :[
			    {name: 'NAME'},
			    {name: 'SERVICEID' }
		      ]
		
	});
	
	var multiVLANCategoryStore = new Ext.data.JsonStore
	({
		url : '../GetComboJson.cnms',
		baseParams :
		{
			comboId : 'getVLANCategoryByRouter'
		},
		fields :
		[
			{name : 'combovalue'},
			{name : 'comboid'}
		]
	});

	var multiVlanserviceCategoryStore = new Ext.data.ArrayStore({
        fields: ['combovalue', 'comboid'],
        data : [
			['L3 Layer', 'L3 Layer'],
        	['L2 Layer', 'L2 Layer']
		]
    });

	var multipleVlanLinkForm = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        labelWidth: 190,
        frame:true,
        items: [
        	{
        		xtype : 'checkbox',
				fieldLabel : 'Special QOS Looping Required',
				id : 'multiVlanSpecialQosLoopingReq-id',
				name : 'multiVlanSpecialQosLoopingReq',
				listeners :
				{
					check : function()
					{
        				if (Ext.getCmp('multiVlanSpecialQosLoopingReq-id').checked == true
								&& Ext.get('multiVlanRouterHostName-id').getValue() != ''){
								multiVlanGetIpBearerPortName();

						}
						else if(Ext.getCmp('multiVlanSpecialQosLoopingReq-id').checked == false
								&& Ext.get('multiVlanRouterHostName-id').getValue() != '' ){
							multiVlanNameGeneration();
						}
					}
				}
			},{
        		xtype:'combo',
                anchor:'100%',
                fieldLabel:'Service Id ',
         		id:'multiVlanservieId',
                name:'multiVlanserviceName',
                displayField:'NAME',
	 			valueField:'SERVICEID',
                value:'-------- Select ---------',
         		store: multiVlanServiceNameStore,
         		triggerAction:'all',
         		autoCreate:{tag:"input", type:"text", size:"40", autocomplete:"off", qtip: "Please Select Service for Upgradation"},
         		mode:'remote',
         		anchor:'95%',
                typeAhead: false,
                selectOnFocus:true,
                allowBlank: false,
                forceSelection:false,
                selectOnFocus :true,
                disabled :false,
                minChars : 1,
                listeners :	{
					select: function(){
         				multipleVlanLinkForm.getEl().mask('Fetching Service Details...');
 						Ext.getCmp('multiVlanRouterHostName-id').setValue("");
						Ext.getCmp('multiVlanRouterFreePort-id').setValue("");								 
						Ext.getCmp('multiVlanCPENode-id').setValue("");
						Ext.getCmp('multiVlanCPEPort-id').setValue("");
						Ext.Ajax.request({
							url : '../ValidateFormData.cnms',
							params :
							{
								method : 'serviceCircuitAssociation',
								serviceId: Ext.getCmp('multiVlanservieId').getValue()
							},
							method : 'POST',
							success : function(result, request)
							{
								var jsonData = Ext.util.JSON.decode(result.responseText);
								var error = jsonData.error;
								var circuitId = jsonData.circuitID;
								var vlanCir = jsonData.vlanStatus;
								
								if(error == "IPBNOTFOUND"){
									Ext.MessageBox.alert('Failed','IP Bearer/L2 Tunnel is not associated with given Service');
								}
								else if (error == "NONTRUNKCASE"){
									Ext.MessageBox.alert('Failed','This is not Valid Trunk Case');
								}
								else if (error == "ROUTERNOTFOUND"){
									Ext.MessageBox.alert('Failed','Router not Found for given Service');
								}
								else {
									 routerPort = jsonData.routerPort;
									 var cpePort = jsonData.cpePort;
									 Ext.getCmp('multiVlanRouterHostName-id').setValue(jsonData.ROUTERHOSTNAME);
									 Ext.getCmp('multiVlanRouterFreePort-id').setValue(jsonData.ROUTERPORTNAME);
									 
									 Ext.getCmp('multiVlanCPENode-id').setValue(jsonData.CPENODENAME);
									 Ext.getCmp('multiVlanCPEPort-id').setValue(jsonData.CPEPORTNAME);
									 routerNodeId = jsonData.ROUTERHOSTID;
									 routerPortId = jsonData.ROUTERPORTID;
									 cpePortId = jsonData.CPEPORTID;
									 cpeNodeId = jsonData.CPENODEID;
									 vlanCircuitId = jsonData.VLANCIRCUTIID;
									 serviceType = jsonData.SERVICETYPE;
									 isQoSCase = jsonData.ISQOSCASE;
									 getNoOfVlanForServiceType();
									 multiVLANCategoryStore.setBaseParam('ROUTERNODEID', routerNodeId);
	            					 multiVLANCategoryStore.load();
	            					 
	            					 document.getElementById('hiddenServiceNameId').value = Ext.getCmp('multiVlanservieId').getRawValue();
	            					 document.getElementById('hiddenServiceTypeId').value = serviceType;
	            					 
	            					 if(isQoSCase == "true"){
	            						 //Ext.getCmp('multiVlanSpecialQosLoopingReq-id').check = true;
	            						 var myCheckBox = Ext.getCmp('multiVlanSpecialQosLoopingReq-id'); 
	            						 myCheckBox.suspendEvents(false); // Stop all events. 
										 //Be careful with it. Dont forget resume events!
										 myCheckBox.setValue(true); // invert value
										 myCheckBox.resumeEvents();
										 multiVlanGetIpBearerPortName();
	            					 }
								}
								multipleVlanLinkForm.getEl().unmask();
							},
							failure : function(result, request)
							{
								Ext.MessageBox.alert('Failed',result.responseText);
								multipleVlanLinkForm.getEl().unmask();
							}
						});
					}
				}
        	},
        	{
				xtype : 'checkbox',
				fieldLabel : 'Use Existing Service Id',
				id : 'UseExistServiceId',
				name : 'UseExistServiceName',
				listeners :
				{
					check : function()
					{
        				if(Ext.getCmp('UseExistServiceId').checked){
        					
        					Ext.getCmp('ExistServiceId').enable();
        				}
        				else{
        					Ext.getCmp('ExistServiceId').reset();
        					Ext.getCmp('ExistServiceId').disable();
        				}
					}
				}
			},
			{
				xtype:'combo',
                anchor:'100%',
                fieldLabel:'Existing Service Id ',
         		id:'ExistServiceId',
                name:'ExistServiceName',
                displayField:'NAME',
	 			valueField:'SERVICEID',
                value:'-------- Select ---------',
         		store: multiVlanServiceNameStore,
         		triggerAction:'all',
         	    autoCreate:{tag:"input", type:"text", size:"40", autocomplete:"off", qtip: "Please Select Router for which you want create Last mile"},
         		mode:'remote',
         		anchor:'95%',
                typeAhead: false,
                selectOnFocus:true,
                allowBlank: false,
                forceSelection:false,
                selectOnFocus :true,
                disabled :true,
                minChars : 1,
       			listeners:{
        		
        		}
        	},
        	{
				xtype: 'textfield',
				fieldLabel:'Router Host Name',
         		id:'multiVlanRouterHostName-id',
                name:'multiVlanRouterHostName',
				readOnly:true,
				allowBlank: false,
				anchor:'95%'

			},
// 			{
//				xtype: 'textfield',
//				fieldLabel: 'Router IP Address',
//				id: 'multiVlanRouterIpAddress-id',
//				name: 'multiVlanRouterIpAddress',
//				readOnly:true,
//				allowBlank: false,
//				anchor:'95%'
//
//			},
			{
				xtype: 'textfield',
				fieldLabel: 'Router Port Name',
				id: 'multiVlanRouterFreePort-id',
				name: 'multiVlanRouterFreePortName',
				editable : false,
				readOnly : true,
				anchor:'95%',
				allowBlank:false

 			},
 			{
				xtype : 'textfield',
				fieldLabel : 'CPE Node',
				id : 'multiVlanCPENode-id',
				name : 'multiVlanCPENode',
				disabled : false,
				readOnly : true,
				anchor : '95%'
			},
 			{
				xtype : 'textfield',
				fieldLabel : ' CPE Port Name',
				id : 'multiVlanCPEPort-id',
				name : 'multiVlanCPEPort',
				disabled : false,
				readOnly : true,
				anchor : '95%'
			},
			{
				xtype : 'checkbox',
				name : 'multiVLANAssociatedtoServiceID',
				id : 'multiVLANAssociatedtoServiceID-id',
				fieldLabel : 'VLAN already reserved',
				disabled : false,
				listeners :
				{
					check : function()
					{
						if (Ext.getCmp('multiVLANAssociatedtoServiceID-id').checked == true)
						{
							Ext.getCmp('createMultiVlan').enable();
							Ext.getCmp('reserveMultiVlan').disable();
							Ext.getCmp('multiVlanNoOfVlan-id').enable();
							Ext.getCmp('multiVlanFreeOnRouter-id').enable();
							Ext.getCmp('multiVlanIpBearerPortName-id').disable();
							Ext.getCmp('multiVlanCategory-id').disable();
							reserveVlan = 'true';
						}
						if (Ext.getCmp('multiVLANAssociatedtoServiceID-id').checked == false)
						{
							Ext.getCmp('createMultiVlan').disable();
							Ext.getCmp('reserveMultiVlan').enable();
							Ext.getCmp('multiVlanFreeOnRouter-id').disable();
							Ext.getCmp('multiVlanIpBearerPortName-id').disable();
							Ext.getCmp('multiVlanCategory-id').enable();
							reserveVlan='false';
						}
					},
					change : function(){
							Ext.getCmp('multiVlanCategory-id').setValue("");
							Ext.getCmp('multiVlanFreeOnRouter-id').setValue("");
							Ext.getCmp('multiVlanIpBearerPortName-id').setValue("");

					}
				}
			},
			
			{
				xtype: 'numberfield',
				fieldLabel: 'No of Vlan',
				id: 'multiVlanNoOfVlan-id',
				name: 'multiVlanNoOfVlan',
				readOnly: false,
				allowBlank: false,
				defaultValue: "0",
				autoCreate:{tag:"input", type:"text", size:"40", autocomplete:"off", qtip: "Please Enter Number of Vlan required"},
				disabled : false,
				anchor:'95%',
				listeners :
						{
//							render: function(){
//								Ext.Ajax.request
//								(
//									{
//									url : '../EthWithTxWTopo.cnms',
//									params :
//									{
//										method : 'checkForMultipleVlanServices',
//										serviceType: serviceType
//									},
//									method : 'POST',
//									success : function(result, request)
//									{
//										var jsonData = Ext.util.JSON.decode(result.responseText);
//										result = jsonData.result;
//										if (result == "false")
//										{
//											Ext.getCmp('multiVlanNoOfVlan-id').setValue("1");
//											Ext.getDom('multiVlanNoOfVlan-id').readOnly = true;
//										}
//									},
//									failure : function(result, request)
//									{
//										Ext.MessageBox.alert('Failed',result.responseText);
//									}
//								});
//							},
							change : function()
							{
							Ext.getCmp('multiVlanCategory-id').setValue("");
							Ext.getCmp('multiVlanFreeOnRouter-id').setValue("");
							Ext.getCmp('multiVlanIpBearerPortName-id').setValue("");
							}
						}
			},
 			{
				xtype : 'combo',
				fieldLabel : 'VLAN Category',
				id : 'multiVlanCategory-id',
				name : 'multiVlanCategoryName',
				displayField : 'combovalue',
				valueField : 'comboid',
				emptyText : '-------- Select ---------',
				blankText : 'VLAN Category is Required.',
				store : multiVLANCategoryStore,
				triggerAction : 'all',
				autoCreate:{tag:"input", type:"text", size:"40", autocomplete:"off", qtip: "Please Select Vlan Category"},
				mode : 'remote',
				anchor : '95%',
				typeAhead : false,
				selectOnFocus : true,
				allowBlank : false,
				forceSelection : true,
				disabled : false,
				minChars : 1,
				listeners :
				{
					select : function()
					{
						multipleVlanLinkForm.getEl().mask('Searching Free Vlan..');
						Ext.Ajax.request
						(
							{
							url : '../EthWithTxWTopo.cnms',
							params :
							{
								method : 'getVlanNumber',
								category : Ext.getCmp('multiVlanCategory-id').getValue(),
								noofVlan : Ext.getCmp('multiVlanNoOfVlan-id').getValue(),
								router : Ext.get('multiVlanRouterHostName-id').dom.value
							},
							method : 'POST',
							success : function(result, request)
							{
								var jsonData = Ext.util.JSON.decode(result.responseText);
								vlanNo = jsonData.VLANNO;
								if (vlanNo == "No Free VLAN No. available.")
								{
									vlanNo = 0;
									alert("No Free VLAN Number available");
								}
								Ext.getCmp('multiVlanFreeOnRouter-id').setValue(vlanNo);
								multiVlanGetIpBearerPortName();
								multipleVlanLinkForm.getEl().unmask();
							},
							failure : function(result, request)
							{
								Ext.MessageBox.alert('Failed',result.responseText);
								multipleVlanLinkForm.getEl().unmask();
							}
						});
						
					}
				}
			},
			{
				xtype : 'textfield',
				fieldLabel : 'VLAN Free On Router',
				id : 'multiVlanFreeOnRouter-id',
				name : 'multiVlanFreeOnRouterName',
				anchor : '95%',
				disabled : false,
				autoCreate:{tag:"input", type:"text", size:"40", autocomplete:"off", qtip: "Will be feteched from by System"},
				readOnly : false,
				listeners :
				{
					blur : function()
					{
						if(Ext.getCmp('multiVLANAssociatedtoServiceID-id').checked == true && Ext.getCmp('multiVlanSpecialQosLoopingReq-id').checked == false
								&& Ext.get('multiVlanRouterHostName-id').getValue() != ''){
							multiVlanNameGeneration();
						}else if(Ext.getCmp('multiVlanSpecialQosLoopingReq-id').checked == true
								&& Ext.get('multiVlanRouterHostName-id').getValue() != ''){
							multiVlanGetIpBearerPortName();
						}
						else {
							multiVlanGetIpBearerPortName();
						}
					},
					change : function()
					{
						Ext.getCmp('multiVlanIpBearerPortName-id').setValue("");
					}
				}
			},
			{
				xtype : 'textfield',
				fieldLabel : 'IP Bearer Port Name',
				id : 'multiVlanIpBearerPortName-id',
				name : 'multiVlanIpBearerPortName',
				readOnly : true,
				disabled : false,
				anchor : '95%'
			},
			{
				xtype :'combo',
				fieldLabel :'Service Category',
				id :'multiVlanserviceCategory-id',
				name :'multiVlanserviceCategory',
				triggerAction :'all',
				anchor :'95%',
				allowBlank :false,
        		mode: 'local',
        		autoSelect : true,
				store : multiVlanserviceCategoryStore,
				autoCreate:{tag:"input", type:"text", size:"40", autocomplete:"off", qtip: "Please Select Service Category"},
				displayField :'combovalue',
				valueField :'comboid',
				listeners:{
					render : function(){
						Ext.getCmp('multiVlanserviceCategory-id').setValue("L3 Layer");
				 	}
        		}
			}
        ]
    });

multipleVlanUpgradeWinLink = new Ext.Window({

		title: 'Multiple Vlan Upgrade and Shared LM',
        width: 500,
        height:480,
        minWidth: 350,
        minHeight: 200,
        layout: 'fit',
        plain:true,
        bodyStyle:'padding:5px;',
        buttonAlign:'center',
        closable: false,
        items: multipleVlanLinkForm,

        buttons: [
        			{
			text : 'Reserve VLAN',
			id : 'reserveMultiVlan',
			//disabled : true,
			handler : function()
			{
				if (multipleVlanLinkForm.getForm().isValid())
				{
					Ext.MessageBox.show
					({
						title : 'Please wait',
						msg : 'Reserving VLAN...',
						width : 300,
						closable : false,
						animEl : 'Reserve VLAN'
					});
					reserveVlan = 'true';
					Ext.Ajax.request
					({
						url : '../EthWithTxWTopo.cnms',
						params :
						{
							method : 'reserveVLANNumber',
							category : Ext.getCmp('multiVlanCategory-id').getValue(),
							router : Ext.get('multiVlanRouterHostName-id').getValue(),
							routerName : Ext.getCmp('multiVlanRouterHostName-id').getValue(),
							vlanNumber : Ext.get('multiVlanFreeOnRouter-id').dom.value,
							serviceName : Ext.get('multiVlanservieId').dom.value,
							uname : userName
						},
						method : 'POST',
						success : function(result, request)
						{
							var jsonData = Ext.util.JSON.decode(result.responseText);
							isVlanReserved = jsonData.RESERVED;
							if (isVlanReserved)
							{
								Ext.MessageBox.alert("VLAN Reserved ");
								Ext.getCmp('createMultiVlan').enable();
								Ext.getCmp('reserveMultiVlan').disable();
							} else
							{
								Ext.MessageBox.alert("VLAN Reservation Failed ");
								Ext.getCmp('createMultiVlan').disable();
							}
						},
						failure : function(result, request)
						{
							Ext.MessageBox.alert('Failed',result.responseText);
						}
					});
				} else
				{
					Ext.MessageBox.alert('failed','Some Fields are blank');
				}
		}
		},
        	{
            text: 'Create Circuit',
            id : 'createMultiVlan',
			disabled : true,
            handler: function(){
        		if(multipleVlanLinkForm.getForm().isValid()){

		        	Ext.MessageBox.show({

		        		title: 'Please wait',
		 				msg: 'Creating circuit...',
	                    width:300,
	                    closable:false,
	                    animEl: 'Create Circuit'
		            });
		            Ext.Ajax.request({

	    				url : '../MultiVlanCirCreation.cnms' ,
						params : { method : 'createCircuitMultiVlan',

				            	   data1 : circuitTableName,
								   serviceName : Ext.get('multiVlanservieId').dom.value,
								   serviceType : serviceType,
								   ethRouterAlias1:  Ext.get('multiVlanRouterHostName-id').dom.value,
								   ethRouterId:  routerNodeId,
								   ethRouterFreePortName : Ext.get('multiVlanRouterFreePort-id').dom.value,
								   ethRouterFreePortId : routerPortId,
//								   ethRouterIpAddress : Ext.get('multiVlanRouterIpAddress-id').dom.value,
								   ethServiceCategory7 :  Ext.get('multiVlanserviceCategory-id').dom.value,
								   ipPortType : IpPortType,
								   cpeNodeAlias1 : Ext.get('multiVlanCPENode-id').getValue(),
								   cpePortAlias1 : Ext.get('multiVlanCPEPort-id').getValue(),
								   cpeNodeId : cpeNodeId,
								   cpePortId : cpePortId,
								   customerName : '',
								   uname : userName,
//								   handleType : Ext.getCmp('ethWOTxNOVlanHandleType-id').getValue(),
//								   genericCPEId : oldCPEId,
								   requestTrackingID : requestTrackingID,
								   uniqueMultiVlanId: uniqueProcessId,
								   cosReqd : Ext.getCmp('multiVlanSpecialQosLoopingReq-id').checked,
								   portNameQos : portNameQos,
								   ethRouterVlanNo : Ext.get('multiVlanFreeOnRouter-id').dom.value,
								   ethRouterLogicalName : Ext.get('multiVlanIpBearerPortName-id').dom.value,
								   noOfVlan : Ext.get('multiVlanNoOfVlan-id').dom.value,
								   vlanNumbers : Ext.getCmp('multiVlanFreeOnRouter-id').getValue(),
								   vlanCircuitId : vlanCircuitId,
								   isQoSCase : isQoSCase
//								   isVlanReserved : reserveVlan

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
								setTimeout("multiVlanCheckCircuit6Status()",3000);
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
            	}
	        	else{
	        		Ext.MessageBox.alert('failed', 'Some Fields are blank');
	        	}
            }
        },multiVlanAllocateIpButton,
        {
            text: 'Cancel',
            handler: function(){
            	multipleVlanLinkForm.getForm().reset();
            	multipleVlanUpgradeWinLink.hide();
            }
        }]
	});
	multipleVlanUpgradeWinLink.show(this);
});