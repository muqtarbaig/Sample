var switchName = '';
var topologyType = '';
var portName = '';
var ipBearerPortName = '';
var topologyTempTableName = '';
var btsSwitchId = '';
var portNameQos = '';
var circuitTableName = '';
var IpPortType = document.hiddenFields.hiddenIpTypeId.value;
var userName = document.hiddenFields.hiddenuserNameId.value;
var requestTrackingID = Math.floor(Math.random() * 99999999999);
var nodeToLocation = "";
var convertorCase = '';
var convertorCircuitName = '';
var switchCircuitName = '';
var AGSName;
var isALUCase = false;
var wimaxAggregationSwitchID = '';
var wimaxAggregationSwitchPortID  = '';
var seVLANId;
var VLANRangeId;
var PERouterNodeId;

var allocateIpButton_WIMAX = new Ext.Button(
{
    text: 'Allocate IP',
    id: 'Allocate_IP',
    disabled : true,
    handler: function(){
		IllorGvpnIpAutomation(wimaxForALUWin);
	}
});

function checkCircuitStatusWimaxALU() {

	Ext.Ajax
			.request( {
				url : '../WimaxALUServlet.cnms',
				params : {
					method : 'checkCircuitCreationStatus',
					requestTrackingID : requestTrackingID
				},
				method : 'POST',
				success : function(result, request) {
					var jsonData = Ext.util.JSON.decode(result.responseText);

					if (jsonData.success == "true") {

						Ext.MessageBox
								.alert(
										'Success',
										'Circuit Creation Completed Successfully. IP Bearer/L2 Tunnel :' + jsonData.ipborl2tunnelname,
										function() {
											//window.location = redirectUrl;
											//allocateIpButton_NNI.setDisabled(false);
											allocateIpButton_WIMAX.setDisabled(false);
											Ext.getCmp('createCircuitALU-id').disable();
										});
					} else if (jsonData.result != " "
							&& jsonData.result != "FAILED"
							&& jsonData.result != "RFERROR") {

						Ext.MessageBox.show( {

							title : 'Please wait',
							msg : jsonData.result,
							width : 300,
							closable : false
								});
						setTimeout("checkCircuitStatusWimaxALU()", 5000);

					} else if (jsonData.result == "RFERROR") {
						Ext.MessageBox.alert('ERROR ',
								'Data is not proper. Check topology.',
								function() {
									//window.location.reload();
							});

					} else if (jsonData.result == "FAILED") {
						Ext.MessageBox.alert('Result',	"Circuit Creation Failed");
						Ext.getCmp('createCircuitALU-id').disable();
					}
				}

			});
}

var redirectUrl = "http://cboss/PortalV5/ISCReports_1.2/JSPFiles/reloadPage.html";
var nonISC = 'false';


function getIpBearerPortNameQosALU() {
	Ext.Ajax.request( {
		url : '../WimaxALUServlet.cnms',
		params : {
			method : 'getIpBearerPortNameQos',
			data1 : Ext.get('wimaxRouterHostNameALU-id').dom.value
		},
		method : 'POST',
		success : function(result, request) {
			var jsonData = Ext.util.JSON.decode(result.responseText);
			portNameQos = jsonData.IPBEARERPORTNAME;
			vlanNameGenerationWimaxALU();
	},
	failure : function(result, request) {
		Ext.MessageBox.alert('Failed', result.responseText);
	}
	});
}

Ext.onReady(function() {

			Ext.QuickTips.init();

			Ext.form.Field.prototype.msgTarget = 'side';

			Ext.BLANK_IMAGE_URL = 'resources/images/default/s.gif';

			Ext.Ajax.timeout = 9000000;
			
			var routerUplinkId = '';
			
			var wimaxALUSwitchPortNameStore = new Ext.data.JsonStore( {
				url : '../GetComboJson.cnms',
				baseParams : {
					comboId : 'GetSwitchPortNameWimax'
				},
				fields : [ {
					name : 'combovalue'
				}, {
					name : 'comboid'
				} ]
			});
			
			var wimaxALURouterHostNameStore = new Ext.data.JsonStore( {
				url : '../GetComboJson.cnms',
				baseParams : {
					comboId : 'GetRouterHostNameWimax'
				},
				fields : [ {
					name : 'combovalue'
				}, {
					name : 'comboid'
				} ]
			});			

			var wimaxOduNameStore = new Ext.data.JsonStore( {
				url : '../GetComboJson.cnms',
				baseParams : {
					comboId : 'GetIduToOduNameWimax'
				},
				fields : [ {
					name : 'combovalue'
				}, {
					name : 'comboid'
				} ]
			});

			var wimaxIduToAntennaStore = new Ext.data.JsonStore( {
				url : '../GetComboJson.cnms',
				baseParams : {
					comboId : 'GetIduToAntenna'
				},
				fields : [ {
					name : 'combovalue'
				}, {
					name : 'comboid'
				} ]
			});

			var wimaxOduNameStore = new Ext.data.JsonStore( {
				url : '../GetComboJson.cnms',
				baseParams : {
					comboId : 'GetIduToOduNameWimax'
				},
				fields : [ {
					name : 'combovalue'
				}, {
					name : 'comboid'
				} ]
			});

			var wimaxAntennaNameStore = new Ext.data.JsonStore( {
				url : '../GetComboJson.cnms',
				baseParams : {
					comboId : 'GetOduToAntennaNameWimax'
				},
				fields : [ {
					name : 'combovalue'
				}, {
					name : 'comboid'
				} ]
			});

			var wimaxCPENodeStore = new Ext.data.JsonStore( {
				url : '../GetComboJson.cnms',
				baseParams : {
					comboId : 'GetCPENodeWimax'
				},
				fields : [ {
					name : 'combovalue'
				}, {
					name : 'comboid'
				} ]
			});

			var wimaxSSNodeStore = new Ext.data.JsonStore( {
				url : '../GetComboJson.cnms',
				baseParams : {
					comboId : 'GetSSNodeWimax'
				},
				fields : [ {
					name : 'combovalue'
				}, {
					name : 'comboid'
				} ]
			});

			var wimaxVLANCategoryStore = new Ext.data.JsonStore( {
				url : '../GetComboJson.cnms',
				baseParams : {
					comboId : 'getVLANCategoryName'
				},
				fields : [ {
					name : 'combovalue'
				}, {
					name : 'comboid'
				} ]
			});
			function fetchFreeVLAN() {
				if(AGSName != null || AGSName != undefined) {
					Ext.Ajax.request({
		        		url : '../servlet/EthernetScenarioServlet.cnms' ,
						params : { method : 'getFreeVLANFromSEVLAN',
		            			    seVLANId: seVLANId,
		            				categoryName : Ext.get('wimaxVLANCategoryALU-id').dom.value,
		            				number : Ext.get('wimaxNoOfVlanALU-id').dom.value
								},
						method: 'POST',
						success: function ( result, request ) {
									var jsonData = Ext.util.JSON.decode(result.responseText);
									VLANRangeId = jsonData.VLANRangeId;
									freeVLANList = jsonData.freeVLANList;
									Ext.getCmp('wimaxVlanFreeOnRouterALU-id').setValue(freeVLANList);
									//vlanNameGenerationWimaxALU();
								},
						failure : function(result, request)	{
									Ext.MessageBox.alert('Failed',result.responseText);
								}											
					});
				}
				else {
					 Ext.Ajax.request({
				       		url : '../servlet/EthernetScenarioServlet.cnms' ,
							params : { method : 'getFreeVLANFromNode',
					      			    nodeName : Ext.get('wimaxRouterHostNameALU-id').dom.value,
					       				categoryName : Ext.get('wimaxVLANCategoryALU-id').dom.value,
					       				number : Ext.get('wimaxNoOfVlanALU-id').dom.value
									},
							method: 'POST',
							success: function ( result, request ) {
									var jsonData = Ext.util.JSON.decode(result.responseText);
									VLANRangeId = jsonData.VLANRangeId;
									freeVLANList = jsonData.freeVLANList;
									Ext.getCmp('wimaxVlanFreeOnRouterALU-id').setValue(freeVLANList);
									//vlanNameGenerationWimaxALU();
									},
							failure : function(result, request)	{
										Ext.MessageBox.alert('Failed',result.responseText);
									}											
					});
				}
			}
			
			function vlanNameGenerationWimaxALU(){	
				if(isALUCase == true ) {
					vlanNameGenerationWimaxALUNew();
				}
				else {
					vlanNameGenerationWimaxALUOld();
				}
			};
			function vlanNameGenerationWimaxALUNew() {
				var strArray = '';
				var vlanValue = '';
				var strValues = 0;
				var num = '';
				var content = '';
				var index = 0;
				num = Ext.getCmp('wimaxNoOfVlanALU-id').getValue();	
				content = Ext.getCmp('wimaxVlanFreeOnRouterALU-id').getValue();	
				strArray = content.split(",");
				for ( var j = 0; j < strArray.length; j++) {
					if (strArray[j] != '' && strArray[j] != null) {
						strValues++;
					}
				}
				interfaceName = routerUplinkName + ":"+ Ext.getCmp('outerVlanWimaxALU-id').getValue() + ".";
				if (num < strValues) {
					alert("You have to enter " + num + " Vlan numbers Only");
					for ( var j = 0; j < num; j++) {
						vlanValue = vlanValue + interfaceName + strArray[j] + ",";
					}
					index = content.lastIndexOf(strArray[num]);
					Ext.getCmp('wimaxVlanFreeOnRouterALU-id').setValue(
							content.substring(0, index - 1));
					ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
					Ext.getCmp('wimaxIpBearerPortNameALU-id').setValue(ipBearerPortName);
				} else if (num == strValues) {
					for ( var i = 0; i < num; i++) {
						vlanValue = vlanValue + interfaceName + strArray[i] + ",";
					}
					ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
					Ext.getCmp('wimaxIpBearerPortNameALU-id').setValue(ipBearerPortName);
				} else if (num > strValues) {
					alert("You have to enter lesser Vlan numbers ");
					Ext.getCmp('wimaxVlanFreeOnRouterALU-id').setValue("");
					Ext.getCmp('wimaxIpBearerPortNameALU-id').setValue("");
				}
			};
			function vlanNameGenerationWimaxALUOld() {
				var strArray = '';
				var vlanValue = '';
				var strValues = 0;
				var num = '';
				var content = '';
				var index = 0;
				num = Ext.getCmp('wimaxNoOfVlanALU-id').getValue();
				content = Ext.getCmp('wimaxVlanFreeOnRouterALU-id').getValue();
				strArray = content.split(",");
				for ( var j = 0; j < strArray.length; j++) {
					if (strArray[j] != '' && strArray[j] != null) {
						strValues++;
					}
				}
				if (Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == false){ 
					if(topologyType == 'LINEAR') {
						interfaceName = portName + ".";
					}else if(topologyType != 'LINEAR'){
						interfaceName = "Vlan";
					}
				} else if (Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == true) {
			
					interfaceName = portNameQos + ".";
					if(portNameQos == undefined 
							&& Ext.getCmp('wimaxVlanFreeOnRouterALU-id').getValue() != "0"
							&& Ext.getCmp('wimaxVlanFreeOnRouterALU-id').getValue() != ""){
						Ext.MessageBox.alert('Result', "Looping Port Not Found. Unchecking QoS Loop checkbox.");
						Ext.getCmp('wimaxIpBearerPortNameALU-id').setValue("");
						Ext.getCmp('specialQosLoopingReqd12ALU-id').setValue("0");
						vlanNameGenerationWOTWT();
						return;
					}
				}else if (Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == false) {
					interfaceName = "Vlan";
				} 
				if (num < strValues) {
					alert("You have to enter " + num + " Vlan numbers Only");
					for ( var j = 0; j < num; j++) {
						vlanValue = vlanValue + interfaceName + strArray[j] + ",";
					}
					index = content.lastIndexOf(strArray[num]);
					Ext.getCmp('wimaxVlanFreeOnRouterALU-id').setValue(
							content.substring(0, index - 1));
					ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
					Ext.getCmp('wimaxIpBearerPortNameALU-id').setValue(ipBearerPortName);
				} else if (num == strValues) {
					for ( var i = 0; i < num; i++) {
						vlanValue = vlanValue + interfaceName + strArray[i] + ",";
					}
					ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
					Ext.getCmp('wimaxIpBearerPortNameALU-id').setValue(ipBearerPortName);
				} else if (num > strValues) {
					alert("You have to enter lesser Vlan numbers ");
					Ext.getCmp('wimaxVlanFreeOnRouterALU-id').setValue("");
					Ext.getCmp('wimaxIpBearerPortNameALU-id').setValue("");
				}
			};


			var wimaxALUForm = new Ext.form.FormPanel(
					{
						baseCls : 'x-plain',
						labelWidth : 190,
						frame : true,
						listeners : {
							afterrender : function() {

								wimaxSSNodeStore.on('load', function() {
									Ext.getCmp('wimaxSSNodeALU-id').setValue(
											"1900000204");
								});

								wimaxSSNodeStore.load();

								wimaxCPENodeStore.on('load', function() {
									Ext.getCmp('wimaxCPENameALU-id').setValue(
											"1900000180");
								});

								wimaxCPENodeStore.load();

								Ext.getCmp('wimaxVLANCategoryALU-id').setValue("Wi-Max Corporate");
							}
						},
						items : [
								{
									xtype : 'checkbox',
									fieldLabel : 'Special QOS Looping Required',
									id : 'specialQosLoopingReqd12ALU-id',
									listeners : {
										check : function() {

											if (Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == true
													&& Ext.get('wimaxRouterHostNameALU-id').getValue() != '') {

												getIpBearerPortNameQosALU();
											}

											if (Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == false
													&& topologyType == 'RING'
													&& Ext.get('wimaxRouterHostNameALU-id').getValue() != '') {
												vlanNameGenerationWimaxALU();
											}
											if (topologyType == 'LINEAR'
													&& Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == true) {

												Ext.MessageBox.alert('Result',"Looping Not Applicable For Linear Topology");

											} else if (topologyType == 'LINEAR'
													&& Ext.get('wimaxRouterHostNameALU-id').getValue() != '') {
												portNameQos = portName;
												vlanNameGenerationWimaxALU();
											}
										}
									}
								},
								{
									xtype : 'textfield',
									fieldLabel : 'BTS IP Address',
									id : 'wimaxBtsSectorIpAddressALU-id',
									name : 'wimaxBtsSectorIpAddressALU',
									anchor : '95%', // anchor width by percentage
									listeners : {
										change : function() {
											Ext.getCmp('outerVlanWimaxALU-id').setValue("");
											Ext.Ajax
													.request( {
														url : '../WimaxALUServlet.cnms',
														params : {
															method : 'getSwitchDetails',
															data1 : Ext
																	.get('wimaxBtsSectorIpAddressALU-id').dom.value,
															uniqueWimaxId : uniqueProcessId
														},
														method : 'POST',
														success : function(
																result, request) {
															var jsonData = Ext.util.JSON
																	.decode(result.responseText);

															if (jsonData.result == "failed") {

																Ext.MessageBox.alert('Failed',"BTS Switch Not Found");

															} else {

																if (jsonData.BTSSWITCHHOSTNAME == "") {

																	Ext.MessageBox.alert('Failed',"Switch Host Name Not Found");
																} else {

																	Ext.getCmp('wimaxBtsSwitchHostNameALU-id').setValue(jsonData.BTSSWITCHHOSTNAME);
																	Ext.getCmp('wimaxSwitchIpAddressALU-id').setValue(jsonData.BTSSWITCHIPADDRESS);
																	Ext.getCmp('wimaxSwitchPortNameALU-id').setValue(jsonData.BTSSWITCHPORTNAME);
																	btsSwitchId = jsonData.BTSSWITCHID;
																	nodeToLocation = jsonData.BTSSWITCHLOC;
																	convertorCase = jsonData.CONVERTORCASE;
																	convertorCircuitName = jsonData.CONVERTORCIRCUITNAME;
																	switchCircuitName = jsonData.SWITCHCIRCUITNAME;

																	wimaxIduToAntennaStore.setBaseParam('btsIp',
																					Ext.get('wimaxBtsSectorIpAddressALU-id').dom.value);
																	Ext.getCmp('wimaxBtsSwitchHostNameALU-id').focus();
																}
															}
														},
														failure : function(
																result, request) {
															Ext.MessageBox.alert('Failed',result.responseText);
														}
													});
										}
									}
								},
								{
									xtype : 'textfield',
									fieldLabel : 'BTS Switch Host Name',
									id : 'wimaxBtsSwitchHostNameALU-id',
									name : 'wimaxBtsSwitchHostNameALU',
									anchor : '95%',
									readOnly : true,
									listeners : {
										blur : function() {

											switchName = Ext.get('wimaxBtsSwitchHostNameALU-id').getValue();
											wimaxALUSwitchPortNameStore.setBaseParam('switchname',switchName);
											wimaxALUSwitchPortNameStore.load();											
											Ext.Ajax
													.request( {
														url : '../servlet/EthernetScenarioServlet.cnms' ,
														params : {
															method : 'getDetailsFromBS',
															bsName : switchName,
										   					serviceType: Ext.get('serviceType-id').getValue()														
														},
														method: 'POST',
														success: function ( result, request ) {															
															var jsonData = Ext.util.JSON.decode(result.responseText);
															routerName = jsonData.routerName;
															routerUplinkName = jsonData.routerUplinkName;
															AGSName = jsonData.AGSName;
															AGSUplinkName = jsonData.AGSUplinkName;
															RouterIPAddress = jsonData.routerIP;
															PERouterNodeId = jsonData.routerId;
															Ext.getCmp('wimaxRouterHostNameALU-id').setValue(routerName);
															
															if(AGSName != null || AGSName != undefined){
																Ext.getCmp('wimaxAggregationSwitchNameALU-id').setValue(AGSName);
																wimaxAggregationSwitchID = jsonData.AGSId;
																routerUplinkId = jsonData.routerUplinkId;
																routerUplinkName = jsonData.routerUplinkName;
																Ext.getCmp('wimaxAggregationSwitchPortALU-id').setValue(AGSUplinkName);
																wimaxAggregationSwitchPortID = jsonData.AGSUplinkId;
																isALUCase = true;
																Ext.Ajax.request({
											            			url : '../servlet/EthernetScenarioServlet.cnms' ,
																	params : { method : 'getSEVLANFromBS',
											            						bsName: Ext.get('wimaxBtsSwitchHostNameALU-id').getValue()
																			   },
																	method: 'POST',
																	success: function ( result, request ) {						
																			var jsonData = Ext.util.JSON.decode(result.responseText);
																			seVLANName = jsonData.seVLANName;
																			seVLANId = jsonData.seVLANId;
																			Ext.getCmp('outerVlanWimaxALU-id').setValue(seVLANName);
																			if (Ext.get('serviceType-id').dom.value == 'ILL' 
																				&& Ext.getCmp('wimaxNoOfVlanALU-id').getValue()!= null 
																				&& Ext.getCmp('wimaxNoOfVlanALU-id').getValue()!="") {
																				fetchFreeVLAN();
																			}
																		},
																		failure : function(result, request)
																		{
																			Ext.MessageBox.alert('Failed',result.responseText);
																			//ethScenarioForm.getEl().unmask();
																		}											
																});	 
															}else{
																isALUCase = false;
																Ext.getCmp('wimaxAggregationSwitchNameALU-id').disable();
																Ext.getCmp('wimaxAggregationSwitchPortALU-id').disable();
																Ext.Ajax.request({
											            			url : '../EthWOTxWTopo.cnms' ,
																	params : { method : 'getTopologyDetailsWimax',
																			   data1: Ext.get('wimaxBtsSwitchHostNameALU-id').getValue()
																			   },
																	method: 'POST',
																	success: function ( result, request ) {
																				var jsonData = Ext.util.JSON.decode(result.responseText);
																				topologyTempTableName = jsonData.topologyTableName;
																				wimaxALURouterHostNameStore.setBaseParam('tableName',topologyTempTableName);
																				wimaxALURouterHostNameStore.load();	
																				if (Ext.get('serviceType-id').dom.value == 'ILL' 
																					&& Ext.getCmp('wimaxNoOfVlanALU-id').getValue()!= null 
																					&& Ext.getCmp('wimaxNoOfVlanALU-id').getValue()!="") {
																					fetchFreeVLAN();
																				}
																				//ethScenarioForm.getEl().unmask();
																	},
																	failure: function ( result, request) {
																		//ethScenarioForm.getEl().unmask();
																		Ext.MessageBox.alert('Failed', result.responseText);
																	}
																});
															}
															Ext.getCmp('wimaxRouterIpAddressALU-id').setValue(RouterIPAddress);
															Ext.getCmp('wimaxAggregationSwitchPortALU-id').focus();
														},
														failure : function(result, request)
														{
															Ext.MessageBox.alert('Failed',result.responseText);
														}
													});
										}
									}
								},														
								{
									xtype : 'textfield',
									fieldLabel : 'BTS Switch Port Name',
									id : 'wimaxSwitchPortNameALU-id',
									name : 'wimaxSwitchPortNameALU',
									readOnly : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype : 'textfield',
									fieldLabel : 'BTS Switch IP Address',
									id : 'wimaxSwitchIpAddressALU-id',
									name : 'wimaxSwitchIpAddressALU',
									readOnly : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype : 'textfield',
									fieldLabel : 'Aggregation Switch Name',
									id : 'wimaxAggregationSwitchNameALU-id',
									name : 'wimaxAggregationSwitchNameALU',
									readOnly : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype : 'textfield',
									fieldLabel : 'Aggregation Switch Port',
									id : 'wimaxAggregationSwitchPortALU-id',
									name : 'wimaxAggregationSwitchPortALU',
									readOnly : true,
									anchor : '95%',
									listeners:{	
									blur : function(){         				
	            					},
								 }
								},		
								{
									xtype : 'combo',
									fieldLabel : 'Router Host Name',
									id : 'wimaxRouterHostNameALU-id',
									name : 'wimaxRouterHostNameALU',
									triggerAction : 'all',
									editable : false,
									mode : 'local',
									anchor : '95%', // anchor width by percentage
									allowBlank : false,
									store : wimaxALURouterHostNameStore,
									displayField : 'combovalue',
									valueField : 'comboid',
									listeners : {
										change : function() {
												if(PERouterNodeId == undefined){
													PERouterNodeId = Ext.getCmp('wimaxRouterHostNameALU-id').getValue();
												}
												Ext.Ajax
														.request( {
															url : '../WimaxALUServlet.cnms',
															params : {
																method : 'getRouterHostDetails',

																data1 : PERouterNodeId,
																data2 : topologyTempTableName,
																uniqueWimaxId : uniqueProcessId
															},
															method : 'POST',
															success : function(
																	result, request) {
																var jsonData = Ext.util.JSON
																		.decode(result.responseText);
																Ext.getCmp('wimaxRouterIpAddressALU-id').setValue(RouterIPAddress);
																PERouterNodeId = Ext.getCmp('wimaxRouterHostNameALU-id').getValue();
																topologyType = jsonData.topologyType;
	
																if (topologyType == 'LINEAR'
																		&& Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == true) {
	
																	Ext.MessageBox.alert('Result',"Looping Not Applicable For Linear Topology");
	
																} else if (topologyType == 'LINEAR'
																		&& Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == false) {
																	portName = jsonData.portName;
																}
															},
															failure : function(
																	result, request) {
																Ext.MessageBox.alert('Failed',result.responseText);
															}
														});
											}
									}
								},
								{
									xtype : 'textfield',
									fieldLabel : 'Router IP Address',
									id : 'wimaxRouterIpAddressALU-id',
									name : 'wimaxRouterIpAddressALU',
									readOnly : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype: 'textfield',
									fieldLabel: 'Outer Vlan',
									id: 'outerVlanWimaxALU-id',
									name: 'outerVlanWimaxALU',
									readOnly: false,
									allowBlank: false,
									defaultValue: "0",
									autoCreate:{tag:"input", type:"text", size:"40", autocomplete:"off"},
									disabled : true,
									anchor:'95%',
									listeners :
										{
					
										}
								},
								{
									xtype : 'numberfield',
									fieldLabel : 'No of Vlan',
									id : 'wimaxNoOfVlanALU-id',
									name : 'wimaxNoOfVlanALU',
									readOnly : false,
									allowBlank : false,
									disabled : false,
									anchor : '95%',
									listeners : {
										render : function() {
//											if(Ext.get('serviceType-id').dom.value != "GVPN"){
//												Ext.getCmp('wimaxNoOfVlan-id').setValue("1");
//												Ext.getDom('wimaxNoOfVlan-id').readOnly = true;
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
														Ext.getCmp('wimaxNoOfVlanALU-id').setValue("1");
														Ext.getDom('wimaxNoOfVlanALU-id').readOnly = true;
													}
													
												},
												failure : function(result, request)
												{
													Ext.MessageBox.alert('Failed',result.responseText);
												}
											});
											
											
										},
										blur : function() {											
											},
										change : function() { 
											fetchFreeVLAN();
										}
									}
								},
								{
									xtype : 'textfield',
									fieldLabel : 'VLAN Category',
									id : 'wimaxVLANCategoryALU-id',
									name : 'wimaxVLANCategoryALU',
									readOnly : true,
									anchor : '95%',
									listeners : {
										select : function() {
											Ext.Ajax
													.request( {
														url : '../EthWithTxWTopo.cnms',
														params : {
															method : 'getVlanNumber',
															category : Ext.getCmp('wimaxVLANCategoryALU-id').getValue(),
															noofVlan : Ext.getCmp('wimaxNoOfVlanALU-id').getValue(),
															router : Ext.get('wimaxRouterHostNameALU-id').dom.value
														},

														method : 'POST',
														success : function(
																result, request) {
															var jsonData = Ext.util.JSON.decode(result.responseText);
															vlanNo = jsonData.VLANNO;
															if (vlanNo == "No Free VLAN No. available.") {
																vlanNo = 0;
																alert("No Free VLAN Number available");
															}
															Ext.getCmp('wimaxVlanFreeOnRouterALU-id').setValue(vlanNo);
														},
														failure : function(
																result, request) {
															Ext.MessageBox.alert('Failed',result.responseText);
														}
													});
										},										
									}
								},
								{
									xtype : 'textfield',
									fieldLabel : 'VLAN Free On Router',
									id : 'wimaxVlanFreeOnRouterALU-id',
									name : 'wimaxVlanFreeOnRouterALU',
									anchor : '95%',
									readOnly : false,
									listeners : {
										blur : function() {
											if (Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == true) { //Special QOS Looping Data

												getIpBearerPortNameQosALU();
											}
											if (topologyType == 'RING'
													&& Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == false) {
												vlanNameGenerationWimaxALU();
											}
											if (topologyType == 'LINEAR'
													&& Ext.getCmp('specialQosLoopingReqd12ALU-id').checked == false) {
												portNameQos = portName;
												vlanNameGenerationWimaxALU();
											}
											if (isALUCase) {
												vlanNameGenerationWimaxALU();
											}
										}
									}
								},
								{
									xtype : 'checkbox',
									name : 'wimaxVLANAssociatedtoServiceID',
									id : 'wimaxVLANAssociatedtoServiceIDALU-id',
									fieldLabel : 'VLAN already reserved',
									listeners : {
										check : function() {
											if (Ext.getCmp('wimaxVLANAssociatedtoServiceIDALU-id').checked == true) {
												Ext.getCmp('reserveWimaxALU').disable();
												Ext.getCmp('createCircuitALU-id').enable();
											}
											if (Ext.getCmp('wimaxVLANAssociatedtoServiceIDALU-id').checked == false) {
												Ext.getCmp('createCircuitALU-id').disable();
												Ext.getCmp('reserveWimaxALU').enable();
											}
										}
									}

								},
								{
									xtype : 'textfield',
									fieldLabel : 'IP Bearer Port Name',
									id : 'wimaxIpBearerPortNameALU-id',
									name : 'wimaxIpBearerPortNameALU',
									readOnly : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype : 'combo',
									fieldLabel : 'Sector Id',
									id : 'wimaxAntennaALU-id',
									name : 'wimaxAntennaNameALU',
									triggerAction : 'all',
									anchor : '95%',
									minChars : 0,
									allowBlank : false,
									store : wimaxIduToAntennaStore,
									displayField : 'combovalue',
									valueField : 'comboid',
									listeners : {
										select : function() {
											Ext.Ajax
													.request( {
														url : '../WimaxALUServlet.cnms',
														params : {
															method : 'getOduDetails',
															antennaId : Ext.getCmp('wimaxAntennaALU-id').getValue()
														},
														method : 'POST',
														success : function(
																result, request) {
															var jsonData = Ext.util.JSON.decode(result.responseText);
															Ext.getCmp('wimaxOduALU-id').setValue(jsonData.oduId);

														},
														failure : function(
																result, request) {
															Ext.MessageBox.alert('Failed',result.responseText);
														}
													});
										}
									}
								},
								{
									xtype : 'textfield',
									id : 'wimaxOduALU-id',
									name : 'wimaxOduNameALU',
									hidden : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype : 'combo',
									fieldLabel : 'SS Node',
									id : 'wimaxSSNodeALU-id',
									name : 'wimaxSSNodeNameALU',
									triggerAction : 'all',
									anchor : '95%',
									minChars : 0,
									allowBlank : false,
									store : wimaxSSNodeStore,
									displayField : 'combovalue',
									valueField : 'comboid',

									listeners : {
										afterrender : function() {

										}
									}

								},
								{
									xtype : 'combo',
									fieldLabel : 'CPE Node',
									id : 'wimaxCPENameALU-id',
									name : 'wimaxCPENameALU',
									triggerAction : 'all',
									anchor : '95%',
									minChars : 0,
									allowBlank : false,
									store : wimaxCPENodeStore,
									displayField : 'combovalue',
									valueField : 'comboid'

								},{
									xtype : 'textfield',
									fieldLabel : 'SS IP',
									id : 'wimaxSSIPALU-id',
									name : 'wimaxSSIPALU',
									anchor : '95%', // anchor width by percentage
									disabled : true,
									value : 'Reserved for future use'
								}, {
									xtype : 'textfield',
									fieldLabel : 'CPE IP',
									id : 'wimaxCPEIPALU-id',
									name : 'wimaxCPEIPALU',
									disabled : true,
									anchor : '95%', // anchor width by percentage
									value : 'Reserved for future use'
								} ]
					});

			wimaxForALUWin = new Ext.Window(
					{
						title : 'WIMAX (CISCO/Juniper/ALU)',
						width : 450,
						//height : 560,
						minWidth : 300,
						//minHeight : 200,
						autoHeight: true,
						layout : 'fit',
						plain : true,
						bodyStyle : 'padding:5px;',
						buttonAlign : 'center',
						closable: true,
       					closeAction : 'hide',
						x: 500,
						y: 100,
						items : wimaxALUForm,

						buttons : [
								{
									text : 'Reserve VLAN',
									id : 'reserveWimaxALU',
									handler : function() {
										Ext.MessageBox.show( {

											title : 'Please wait',
											msg : 'Reserving VLAN...',
											width : 300,
											closable : false,
											animEl : 'Reserve VLAN'
										});

										Ext.Ajax
												.request( {
													url : '../servlet/EthernetScenarioServlet.cnms',
													params :
													{
														method : 'reserveVLANNumber',
														VLANRangeId : VLANRangeId,
									            		categoryName : Ext.get('wimaxVLANCategoryALU-id').dom.value,
									            		vlanNumber : Ext.get('wimaxVlanFreeOnRouterALU-id').dom.value,
														serviceName : Ext.get('serviceId-id').dom.value,
														uname : userName
													},
													method : 'POST',
													success : function(result,
															request) {
														var jsonData = Ext.util.JSON
																.decode(result.responseText);
														isVlanReserved = jsonData.RESERVED;
														//alert("isVlanReserved -->"+isVlanReserved);
														if (isVlanReserved) {
															Ext.MessageBox.alert("VLAN Reserved ");
															Ext.getCmp('createCircuitALU-id').enable();
															Ext.getCmp('reserveWimaxALU').disable();
														} else {
															Ext.MessageBox.alert("VLAN Reservation Failed ");
															Ext.getCmp('createCircuitALU-id').disable();
														}
													},
													failure : function(result,
															request) {
														Ext.MessageBox.alert('Failed',result.responseText);
													}
												});
									}
								},
								{
									text : 'Create Circuit',
									id : 'createCircuitALU-id',
									disabled : true, 
									handler : function() {

									Ext.MessageBox.show( {

											title : 'Please wait',
											msg : 'Creating circuit...',
											width : 300,
											closable : false,
											animEl : 'Create Circuit'
										});

										Ext.Ajax
												.request( {

													url : '../WimaxALUServlet.cnms',
													params : {
														method : 'createCircuit_ipconfig',
														data1 : circuitTableName,
														serviceName : Ext.get('serviceId-id').dom.value,
														serviceType : Ext.get('serviceType-id').dom.value,
														PERouterVlanNo : Ext.get('wimaxVlanFreeOnRouterALU-id').dom.value,
														PERouterAlias1 : Ext.get('wimaxRouterHostNameALU-id').dom.value,
														PERouterNodeId : PERouterNodeId,
														PERouterLogicalName : Ext.get('wimaxIpBearerPortNameALU-id').dom.value,
														ROUTER_PEMGMTIP : Ext.get('wimaxRouterIpAddressALU-id').dom.value,
														PESwitchAlias1 : Ext.get('wimaxBtsSwitchHostNameALU-id').dom.value,
														PESwitchLogicalName_Hoff : Ext.get('wimaxSwitchPortNameALU-id').dom.value,
														SWITCH_PEMGMTIP : Ext.get('wimaxSwitchIpAddressALU-id').dom.value,
														noOfVlan : Ext.get('wimaxNoOfVlanALU-id').dom.value,
														ipPortType : IpPortType,
														location : nodeToLocation,
														antennaId : Ext.getCmp('wimaxAntennaALU-id').value,
														oduId : Ext.getCmp('wimaxOduALU-id').value,
														SSId : Ext.getCmp('wimaxSSNodeALU-id').value,
														CPEId : Ext.getCmp('wimaxCPENameALU-id').value,
														SSip : Ext.get('wimaxSSIPALU-id').getValue(),
														CPEip : Ext.get('wimaxCPEIPALU-id').getValue(),
														data1 : Ext.get('serviceId-id').dom.value,
														data2 : Ext.getCmp('customerName-id').getValue(),
														data6 : Ext.getCmp('specialQosLoopingReqd12ALU-id').checked,
														data7 : portNameQos,
														data8 : ipBearerPortName,
														data9 : Ext.getCmp('wimaxBtsSectorIpAddressALU-id').getValue(),
														data10 : btsSwitchId,
														data11 : topologyTempTableName,
														data12 : Ext.getCmp('wimaxRouterHostNameALU-id').getValue(),
														uname : userName,
														requestTrackingID : requestTrackingID,
														uniqueWimaxId : uniqueProcessId,
														convertorCase : convertorCase,
														convertorCircuitName : convertorCircuitName,
														switchCircuitName : switchCircuitName,
														isALUCase : isALUCase,
														AggregationSwitchNameALU: Ext.get('wimaxAggregationSwitchNameALU-id').dom.value,
														AggregationSwitchIdALU: wimaxAggregationSwitchID,
														AggregationSwitchPortALU: Ext.get('wimaxAggregationSwitchPortALU-id').dom.value,
														AggregationSwitchPortIdALU: wimaxAggregationSwitchPortID,
														routerUplinkId: routerUplinkId,
														routerUplinkName: routerUplinkName,
														ScenarioName : 'WIMAX',
														ssNodeDefName: 	Ext.get('wimaxSSNodeALU-id').dom.value,
														cpeNodeDefName:	Ext.get('wimaxCPENameALU-id').dom.value,
														
													},
													method : 'POST',
													success : function(result,
															request) {
														var jsonData = Ext.util.JSON.decode(result.responseText);

														if (result.responseText == "true") {
															Ext.MessageBox
																	.show( {
																		title : 'Please wait',
																		msg : 'Circuit Creation Started........',
																		width : 300,
																		closable : false
																	});
															setTimeout("checkCircuitStatusWimaxALU()",3000);
														} else {

															Ext.MessageBox.alert('failed','Circuit Creation Failed',
																			function() {
																				window.location = redirectUrl;
																			});
														}

													},
													failure : function(result,
															request) {
														Ext.MessageBox.alert('failed','Circuit Creation Failed');

													}
												});
									}
								},allocateIpButton_WIMAX,
								{
									text : 'Cancel',
									handler : function() {
										wimaxALUForm.getForm().reset();
										wimaxForALUWin.hide();
									}
								} ]
					});

		})
