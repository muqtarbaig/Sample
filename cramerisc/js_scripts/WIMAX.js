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

var allocateIpButton_WIMAX = new Ext.Button(
{
    text: 'Allocate IP',
    id: 'Allocate_IP',
    disabled : true,
    handler: function(){
		IllorGvpnIpAutomation(wimaxWin);
	}
});

function checkCircuitStatus() {

	Ext.Ajax
			.request( {
				url : '../Wimax.cnms',
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
											allocateIpButton_NNI.setDisabled(false);
											allocateIpButton_WIMAX.setDisabled(false);
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
						setTimeout("checkCircuitStatus()", 5000);

					} else if (jsonData.result == "RFERROR") {
						Ext.MessageBox.alert('ERROR ',
								'Data is not proper. Check topology.',
								function() {
									//window.location.reload();
							});

					} else if (jsonData.result == "FAILED") {
						Ext.MessageBox.alert('Result',	"Circuit Creation Failed");
					}
				}

			});
}

var redirectUrl = "http://cboss/PortalV5/ISCReports_1.2/JSPFiles/reloadPage.html";
var nonISC = 'false';
function vlanNameGenerationWimax() {
	var strArray = '';
	var vlanValue = '';
	var strValues = 0;
	var num = '';
	var content = '';
	var index = 0;
	num = Ext.getCmp('wimaxNoOfVlan-id').getValue();
	content = Ext.getCmp('wimaxVlanFreeOnRouter-id').getValue();
	strArray = content.split(",");
	for ( var j = 0; j < strArray.length; j++) {
		if (strArray[j] != '' && strArray[j] != null) {
			strValues++;
		}
	}
	if (Ext.getCmp('specialQosLoopingReqd12-id').checked == false){ 
		if(topologyType == 'LINEAR') {
			interfaceName = portName + ".";
		}else if(topologyType != 'LINEAR'){
			interfaceName = "Vlan";
		}
	} else if (Ext.getCmp('specialQosLoopingReqd12-id').checked == true) {

		interfaceName = portNameQos + ".";
		if(portNameQos == undefined 
				&& Ext.getCmp('wimaxVlanFreeOnRouter-id').getValue() != "0"
				&& Ext.getCmp('wimaxVlanFreeOnRouter-id').getValue() != ""){
			Ext.MessageBox.alert('Result', "Looping Port Not Found. Unchecking QoS Loop checkbox.");
			Ext.getCmp('wimaxIpBearerPortName-id').setValue("");
			Ext.getCmp('specialQosLoopingReqd12-id').setValue("0");
			vlanNameGenerationWOTWT();
			return;
		}
	}else if (Ext.getCmp('specialQosLoopingReqd12-id').checked == false) {
		interfaceName = "Vlan";
	} 
	if (num < strValues) {
		alert("You have to enter " + num + " Vlan numbers Only");
		for ( var j = 0; j < num; j++) {
			vlanValue = vlanValue + interfaceName + strArray[j] + ",";
		}
		index = content.lastIndexOf(strArray[num]);
		Ext.getCmp('wimaxVlanFreeOnRouter-id').setValue(
				content.substring(0, index - 1));
		ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
		Ext.getCmp('wimaxIpBearerPortName-id').setValue(ipBearerPortName);
	} else if (num == strValues) {
		for ( var i = 0; i < num; i++) {
			vlanValue = vlanValue + interfaceName + strArray[i] + ",";
		}
		ipBearerPortName = vlanValue.substring(0, vlanValue.length - 1);
		Ext.getCmp('wimaxIpBearerPortName-id').setValue(ipBearerPortName);
	} else if (num > strValues) {
		alert("You have to enter lesser Vlan numbers ");
		Ext.getCmp('wimaxVlanFreeOnRouter-id').setValue("");
		Ext.getCmp('wimaxIpBearerPortName-id').setValue("");
	}
};

function getIpBearerPortNameQos() {
	Ext.Ajax.request( {
		url : '../Wimax.cnms',
		params : {
			method : 'getIpBearerPortNameQos',
			data1 : Ext.get('wimaxRouterHostName-id').dom.value
		},
		method : 'POST',
		success : function(result, request) {
			var jsonData = Ext.util.JSON.decode(result.responseText);
			portNameQos = jsonData.IPBEARERPORTNAME;
			vlanNameGenerationWimax();
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

			var wimaxSwitchPortNameStore = new Ext.data.JsonStore( {
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

			var wimaxRouterHostNameStore = new Ext.data.JsonStore( {
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

			var wimaxForm = new Ext.form.FormPanel(
					{
						baseCls : 'x-plain',
						labelWidth : 190,
						frame : true,
						listeners : {
							afterrender : function() {

								wimaxSSNodeStore.on('load', function() {
									Ext.getCmp('wimaxSSNode-id').setValue(
											"1900000204");
								});

								wimaxSSNodeStore.load();

								wimaxCPENodeStore.on('load', function() {
									Ext.getCmp('wimaxCPEName-id').setValue(
											"1900000180");
								});

								wimaxCPENodeStore.load();

								Ext.getCmp('wimaxVLANCategory-id').setValue("Wi-Max Corporate");
							}
						},
						items : [
								{
									xtype : 'checkbox',
									fieldLabel : 'Special QOS Looping Required',
									id : 'specialQosLoopingReqd12-id',
									listeners : {
										check : function() {

											if (Ext.getCmp('specialQosLoopingReqd12-id').checked == true
													&& Ext.get('wimaxRouterHostName-id').getValue() != '') {
												getIpBearerPortNameQos();
											}

											if (Ext.getCmp('specialQosLoopingReqd12-id').checked == false
													&& topologyType == 'RING'
													&& Ext.get('wimaxRouterHostName-id').getValue() != '') {
												vlanNameGenerationWimax();
											}
											if (topologyType == 'LINEAR'
													&& Ext.getCmp('specialQosLoopingReqd12-id').checked == true) {

												Ext.MessageBox.alert('Result',"Looping Not Applicable For Linear Topology");

											} else if (topologyType == 'LINEAR'
													&& Ext.get('wimaxRouterHostName-id').getValue() != '') {
												portNameQos = portName;
												vlanNameGenerationWimax();
											}
										}
									}
								},
								{
									xtype : 'textfield',
									fieldLabel : 'WIMAX BTS Sector IP Address',
									id : 'wimaxBtsSectorIpAddress-id',
									name : 'wimaxBtsSectorIpAddress',
									anchor : '95%', // anchor width by percentage
									listeners : {
										change : function() {
											Ext.Ajax
													.request( {
														url : '../Wimax.cnms',
														params : {
															method : 'getSwitchDetails',
															data1 : Ext
																	.get('wimaxBtsSectorIpAddress-id').dom.value,
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

																	Ext.getCmp('wimaxBtsSwitchHostName-id').setValue(jsonData.BTSSWITCHHOSTNAME);
																	Ext.getCmp('wimaxSwitchIpAddress-id').setValue(jsonData.BTSSWITCHIPADDRESS);
																	Ext.getCmp('wimaxSwitchPortName-id').setValue(jsonData.BTSSWITCHPORTNAME);
																	btsSwitchId = jsonData.BTSSWITCHID;
																	nodeToLocation = jsonData.BTSSWITCHLOC;
																	convertorCase = jsonData.CONVERTORCASE;
																	convertorCircuitName = jsonData.CONVERTORCIRCUITNAME;
																	switchCircuitName = jsonData.SWITCHCIRCUITNAME;

																	wimaxIduToAntennaStore.setBaseParam('btsIp',
																					Ext.get('wimaxBtsSectorIpAddress-id').dom.value);
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
									id : 'wimaxBtsSwitchHostName-id',
									name : 'wimaxBtsSwitchHostName',
									anchor : '95%',
									readOnly : true,
									listeners : {
										change : function() {

											switchName = Ext.get('wimaxBtsSwitchHostName-id').getValue();
											wimaxSwitchPortNameStore.setBaseParam('switchname',switchName);
											wimaxSwitchPortNameStore.load();
											Ext.Ajax
													.request( {
														url : '../Wimax.cnms',
														params : {
															method : 'getTopologyDetailsWimax',
															data1 : Ext.get('wimaxBtsSwitchHostName-id').dom.value
														//,
														//data2 : btsSwitchId
														},
														method : 'POST',
														success : function(
																result, request) {
															var jsonData = Ext.util.JSON
																	.decode(result.responseText);
															topologyTempTableName = jsonData.topologyTableName;
															wimaxRouterHostNameStore.setBaseParam('tableName',topologyTempTableName);
															wimaxRouterHostNameStore.load();

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
									fieldLabel : 'Switch Port Name',
									id : 'wimaxSwitchPortName-id',
									name : 'wimaxSwitchPortName',
									readOnly : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype : 'textfield',
									fieldLabel : 'Switch IP Address',
									id : 'wimaxSwitchIpAddress-id',
									name : 'wimaxSwitchIpAddress',
									readOnly : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype : 'combo',
									fieldLabel : 'Router Host Name',
									id : 'wimaxRouterHostName-id',
									name : 'wimaxRouterHostName',
									triggerAction : 'all',
									editable : false,
									mode : 'local',
									anchor : '95%', // anchor width by percentage
									allowBlank : false,
									store : wimaxRouterHostNameStore,
									displayField : 'combovalue',
									valueField : 'comboid',
									listeners : {
										select : function() {

											Ext.Ajax
													.request( {
														url : '../Wimax.cnms',
														params : {
															method : 'getRouterHostDetails',
															data1 : Ext.getCmp('wimaxRouterHostName-id').getValue(),
															data2 : topologyTempTableName,
															uniqueWimaxId : uniqueProcessId
														},
														method : 'POST',
														success : function(
																result, request) {
															var jsonData = Ext.util.JSON
																	.decode(result.responseText);
															Ext.getCmp('wimaxRouterIpAddress-id').setValue(jsonData.routerHostIpAddress);
															topologyType = jsonData.topologyType;

															if (topologyType == 'LINEAR'
																	&& Ext.getCmp('specialQosLoopingReqd12-id').checked == true) {

																Ext.MessageBox.alert('Result',"Looping Not Applicable For Linear Topology");

															} else if (topologyType == 'LINEAR'
																	&& Ext.getCmp('specialQosLoopingReqd12-id').checked == false) {
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
									id : 'wimaxRouterIpAddress-id',
									name : 'wimaxRouterIpAddress',
									readOnly : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype : 'numberfield',
									fieldLabel : 'No of Vlan',
									id : 'wimaxNoOfVlan-id',
									name : 'wimaxNoOfVlan',
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
														Ext.getCmp('wimaxNoOfVlan-id').setValue("1");
														Ext.getDom('wimaxNoOfVlan-id').readOnly = true;
													}
												},
												failure : function(result, request)
												{
													Ext.MessageBox.alert('Failed',result.responseText);
												}
											});
										},
										change : function() {
//											Ext.getCmp('wimaxVLANCategory-id').setValue("");
											Ext.getCmp('wimaxVlanFreeOnRouter-id').setValue("");
											Ext.getCmp('wimaxIpBearerPortName-id').setValue("");
										}

									}
								},
								{
									xtype : 'textfield',
									fieldLabel : 'VLAN Category',
									id : 'wimaxVLANCategory-id',
									name : 'wimaxVLANCategory',
									readOnly : true,
									anchor : '95%',
									listeners : {
										blur : function() {
											Ext.Ajax
													.request( {
														url : '../EthWithTxWTopo.cnms',
														params : {
															method : 'getVlanNumber',
															category : Ext.getCmp('wimaxVLANCategory-id').getValue(),
															noofVlan : Ext.getCmp('wimaxNoOfVlan-id').getValue(),
															router : Ext.get('wimaxRouterHostName-id').dom.value
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
															Ext.getCmp('wimaxVlanFreeOnRouter-id').setValue(vlanNo);
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
									fieldLabel : 'VLAN Free On Router',
									id : 'wimaxVlanFreeOnRouter-id',
									name : 'wimaxVlanFreeOnRouter',
									anchor : '95%',
									readOnly : false,
									listeners : {
										blur : function() {

											if (Ext.getCmp('specialQosLoopingReqd12-id').checked == true) { //Special QOS Looping Data
												getIpBearerPortNameQos();
											}
											if (topologyType == 'RING'
													&& Ext.getCmp('specialQosLoopingReqd12-id').checked == false) {
												vlanNameGenerationWimax();
											}
											if (topologyType == 'LINEAR'
													&& Ext.getCmp('specialQosLoopingReqd12-id').checked == false) {
												portNameQos = portName;
												vlanNameGenerationWimax();
											}
										}
									}
								},
								{
									xtype : 'checkbox',
									name : 'wimaxVLANAssociatedtoServiceID',
									id : 'wimaxVLANAssociatedtoServiceID-id',
									fieldLabel : 'VLAN already reserved',
									listeners : {
										check : function() {
											if (Ext.getCmp('wimaxVLANAssociatedtoServiceID-id').checked == true) {
												Ext.getCmp('reserveWimax').disable();
												Ext.getCmp('createCircuit-id').enable();
											}
											if (Ext.getCmp('wimaxVLANAssociatedtoServiceID-id').checked == false) {
												Ext.getCmp('createCircuit-id').disable();
												Ext.getCmp('reserveWimax').enable();
											}
										}
									}

								},
								{
									xtype : 'textfield',
									fieldLabel : 'IP Bearer Port Name',
									id : 'wimaxIpBearerPortName-id',
									name : 'wimaxIpBearerPortName',
									readOnly : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype : 'combo',
									fieldLabel : 'Sector Id',
									id : 'wimaxAntenna-id',
									name : 'wimaxAntennaName',
									triggerAction : 'all',
									anchor : '95%',
									minChars : 0,
									allowBlank : false,
									store : wimaxIduToAntennaStore,
									forceSelection:true,
									displayField : 'combovalue',
									valueField : 'comboid',
									listeners : {
										select : function() {
											Ext.Ajax
													.request( {
														url : '../Wimax.cnms',
														params : {
															method : 'getOduDetails',
															antennaId : Ext.getCmp('wimaxAntenna-id').getValue()
														},
														method : 'POST',
														success : function(
																result, request) {
															var jsonData = Ext.util.JSON.decode(result.responseText);
															Ext.getCmp('wimaxOdu-id').setValue(jsonData.oduId);

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
									id : 'wimaxOdu-id',
									name : 'wimaxOduName',
									hidden : true,
									anchor : '95%' // anchor width by percentage

								},
								{
									xtype : 'combo',
									fieldLabel : 'SS Node',
									id : 'wimaxSSNode-id',
									name : 'wimaxSSNodeName',
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
									id : 'wimaxCPEName-id',
									name : 'wimaxCPEName',
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
									id : 'wimaxSSIP-id',
									name : 'wimaxSSIP',
									anchor : '95%', // anchor width by percentage
									disabled : true,
									value : 'Reserved for future use'
								}, {
									xtype : 'textfield',
									fieldLabel : 'CPE IP',
									id : 'wimaxCPEIP-id',
									name : 'wimaxCPEIP',
									disabled : true,
									anchor : '95%', // anchor width by percentage
									value : 'Reserved for future use'
								} ]
					});

			wimaxWin = new Ext.Window(
					{
						title : 'WIMAX',
						width : 450,
						height : 560,
						minWidth : 300,
						minHeight : 200,
						layout : 'fit',
						plain : true,
						bodyStyle : 'padding:5px;',
						buttonAlign : 'center',
						closable : false,
						items : wimaxForm,

						buttons : [
								{
									text : 'Reserve VLAN',
									id : 'reserveWimax',
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
													url : '../EthWithTxWTopo.cnms',
													params : {
														method : 'reserveVLANNumber',
														category : Ext.getCmp('wimaxVLANCategory-id').getValue(),
														router : Ext.get('wimaxRouterHostName-id').dom.value,
														routerName : Ext.getCmp('wimaxRouterHostName-id').getValue(),
														vlanNumber : Ext.get('wimaxVlanFreeOnRouter-id').dom.value,
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
															Ext.getCmp('createCircuit-id').enable();
															Ext.getCmp('reserveWimax').disable();
														} else {
															Ext.MessageBox.alert("VLAN Reservation Failed ");
															Ext.getCmp('createCircuit-id').disable();
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
									id : 'createCircuit-id',
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

													url : '../Wimax.cnms',
													params : {
														method : 'createCircuit',
														data1 : circuitTableName,
														serviceName : Ext.get('serviceId-id').dom.value,
														serviceType : Ext.get('serviceType-id').dom.value,
														PERouterVlanNo : Ext.get('wimaxVlanFreeOnRouter-id').dom.value,
														PERouterAlias1 : Ext.get('wimaxRouterHostName-id').dom.value,
														PERouterId : Ext.getCmp('wimaxRouterHostName-id').getValue(),
														PERouterLogicalName : Ext.get('wimaxIpBearerPortName-id').dom.value,
														ROUTER_PEMGMTIP : Ext.get('wimaxRouterIpAddress-id').dom.value,
														PESwitchAlias1 : Ext.get('wimaxBtsSwitchHostName-id').dom.value,
														PESwitchLogicalName_Hoff : Ext.get('wimaxSwitchPortName-id').dom.value,
														SWITCH_PEMGMTIP : Ext.get('wimaxSwitchIpAddress-id').dom.value,
														noOfVlan : Ext.get('wimaxNoOfVlan-id').dom.value,
														ipPortType : IpPortType,
														location : nodeToLocation,
														antennaId : Ext.getCmp('wimaxAntenna-id').value,
														oduId : Ext.getCmp('wimaxOdu-id').value,
														SSId : Ext.getCmp('wimaxSSNode-id').value,
														CPEId : Ext.getCmp('wimaxCPEName-id').value,
														SSip : Ext.get('wimaxSSIP-id').getValue(),
														CPEip : Ext.get('wimaxCPEIP-id').getValue(),
														data1 : Ext.get('serviceId-id').dom.value,
														data2 : Ext.getCmp('customerName-id').getValue(),
														data6 : Ext.getCmp('specialQosLoopingReqd12-id').checked,
														data7 : portNameQos,
														data8 : ipBearerPortName,
														data9 : Ext.getCmp('wimaxBtsSectorIpAddress-id').getValue(),
														data10 : btsSwitchId,
														data11 : topologyTempTableName,
														data12 : Ext.getCmp('wimaxRouterHostName-id').getValue(),
														uname : userName,
														requestTrackingID : requestTrackingID,
														uniqueWimaxId : uniqueProcessId,
														convertorCase : convertorCase,
														convertorCircuitName : convertorCircuitName,
														switchCircuitName : switchCircuitName
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
															setTimeout("checkCircuitStatus()",3000);
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
										wimaxForm.getForm().reset();
										wimaxWin.hide();
									}
								} ]
					});

		})
