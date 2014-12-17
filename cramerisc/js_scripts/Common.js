/*
	function getIpBearerPortName(){
				
				}

	var specialQosLoopingReqd = new Ext.form.Checkbox({
					 fieldLabel: 'Special QOS Looping Required',
					 id: 'specialQosLoopingReqd-id',
					 listeners:{
					 	check : function(){
					 		alert('check box alert'+Ext.getCmp('wimaxRouterHostName-id').getValue()+'topologyType == '+topologyType);
					 		if(Ext.getCmp('specialQosLoopingReqd-id').checked == true && Ext.get('wimaxRouterHostName-id').getValue() != ''){ //Special QOS Looping Data 
								Ext.Ajax.request({
													url : 'Wimax.do' , 
													params : { method : 'getIpBearerPortNameQos',
															  data1: Ext.get('wimaxRouterHostName-id').dom.value },
													method: 'POST',
													success: function ( result, request ) { 
														var jsonData = Ext.util.JSON.decode(result.responseText);
														ipBearerPortName = jsonData.ipBearerPortName+"."+Ext.get('wimaxVlanFreeOnRouter-id').getValue();
														Ext.getCmp('wimaxIpBearerPortName-id').setValue(ipBearerPortName);
													},
													failure: function ( result, request) { 
														Ext.MessageBox.alert('Failed', result.responseText); 
													}
										});
										
										if(topologyType == 'RING' && Ext.get('specialQosLoopingReqd-id').getValue() != "ON"){
										ipBearerPortName = "Vlan"+Ext.get('wimaxVlanFreeOnRouter-id').getValue();
										Ext.getCmp('wimaxIpBearerPortName-id').setValue(ipBearerPortName);
						
							}else if(topologyType == 'LINEAR' && !Ext.get('specialQosLoopingReqd-id').getValue() != "ON"){
								ipBearerPortName = portName+"."+ Ext.getCmp('wimaxVlanFreeOnRouter-id').getValue();
								Ext.getCmp('wimaxIpBearerPortName-id').setValue(ipBearerPortName);
							}
										
							}
					 	}
					 }
				})
*/
				
				
				