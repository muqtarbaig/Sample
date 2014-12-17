BasicCustomerDetails = {};

//IPL FORM

 var serviceExists ="true";
 var serviceName ="";
 var hiddenServiceName=document.hiddenFields.hiddenServiceNameId.value;
 var hiddenCustName=document.hiddenFields.hiddencustomerNameId.value;
 var hiddenServiceType=document.hiddenFields.hiddenServiceTypeId.value;
 var customerName ="";
 var serviceType="";
 var resultString="";
 var uniqueProcessId = document.hiddenFields.hiddenuniqueProcessId.value;
 
 var serviceIdStore = new Ext.data.JsonStore({
	    	url: '../GetComboJson.cnms',
	    	baseParams:{comboId:'getServiceIdCombo',serviceName:hiddenServiceName},
	    	fields: [
	    	    {name: 'combovalue'},
	    	    {name: 'comboid'}
	    	]
 });
 
 	  
 BasicCustomerDetails.util = function() { 
		    return {
				 BasicCustomerDetailsForm : function(){
					return	[
							{
								fieldLabel: 'Service Id',
				                name: 'serviceId',
				                id : 'serviceId-id',
				                xtype:'textfield',
				                allowBlank:false,
				                readOnly:true,
				                value: hiddenServiceName
       
			    	        }
			    	 
						,
		            {
		                fieldLabel: 'Customer Name',
		                name: 'customerName',
		                id : 'customerName-id',
		                xtype:'textfield',
		                allowBlank:false,
		                readOnly:true,
		                value: hiddenCustName
		            },{
		             
		                fieldLabel: 'Service Type',
		                name: 'serviceType',
		                id : 'serviceType-id',
		                xtype:'textfield',
		                allowBlank:false,
		                readOnly:true,
		                value: hiddenServiceType
		                
		            },{
			        buttons:[
		       		 {
		        		text: 'Get Ports Directly',
		        		handler:  function(){
		        			
							if(Ext.getCmp('serviceId-id').getValue() == '' || Ext.getCmp('customerName-id').getValue() == ''
							|| Ext.getCmp('customerName-id').getValue() == '' )	{
									Ext.MessageBox.alert('Failed', 'Service Details Are Mandatory'); 
									
							}else{							
								// Check if the circuit already exists 
								var IpPortType1 =  document.hiddenFields.hiddenIpTypeId.value;
								
								
								
								Ext.Ajax.request({
													url : '../Wimax.cnms' , 
													params : { serviceName : Ext.get('serviceId-id').dom.value,
															   ipPortType : IpPortType1,
															   method: 'checkCircuitExist' 
															   
															 },
													method: 'POST',
													success: function ( result, request ) { 
													
														if(result.responseText == "true")
														{
	 														   // Ext.getCmp('location_details-id').hide();
				        										Ext.getCmp('GetPortType-id').show();
														}
														else
														{
														  Ext.MessageBox.alert('Failed', 'Circuit Already Exists For the Selected Service'); 
														}
													},
													failure: function ( result, request) { 
																//alert("failed == "+result.responseText);
																Ext.MessageBox.alert('Failed', 'Circuit Already Exists'); 
													} 
												});
								
								
		        			}
		        		}
		      		}]

		        }
//		            ,{
//			            buttons:[{
//			        		text: 'Create Service',
//			        		handler: function(){
//			        				serviceName = document.getElementById("serviceId-id").value;
//			        				
//			        				if(serviceExists == 'false' && Ext.getCmp('customerName-id').getValue() !='' &&  
//				        				Ext.getCmp('serviceType-id').getValue() != '' && serviceName != '' ){
//			        					Ext.Ajax.request({
//													url : '../GetServiceDetails.cnms' , 
//													params : { data1 : serviceName,
//															   data2 : Ext.getCmp('customerName-id').getValue(),
//															   data3 : Ext.getCmp('serviceType-id').getValue(),
//															   data4 : '',
//															   method: 'createService' },
//													method: 'POST',
//													success: function ( result, request ) { 
//																var jsonData = Ext.util.JSON.decode(result.responseText);
//																Ext.MessageBox.alert('Success', jsonData.RESULT); 
//													},
//													failure: function ( result, request) { 
//																Ext.MessageBox.alert('Failed', jsonData.RESULT); 
//													} 
//												});
//			        				}else{
//			        				
//			        						resultString='';
//			        						
//			        						if(Ext.getCmp('customerName-id').getValue() =='' ||  
//				        					   Ext.getCmp('serviceType-id').getValue() == '' || 
//				        					   serviceName == '')	
//				        						resultString = "Please Enter Valid Data";
//				        						
//			        						/*if(serviceExists == 'true' && resultString =='')
//			        						{
//												resultString = "Service Already Exists";
//												
//											}*/						
//										Ext.MessageBox.alert('Failed', resultString); 
//			        				}
//			        			
//			        		}
//			        	}] 
//		            }
		            ]
				}
	 }
}();
	