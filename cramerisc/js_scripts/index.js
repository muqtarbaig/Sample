Ext.onReady(function(){
    
    Ext.QuickTips.init();
    
    Ext.form.Field.prototype.msgTarget = 'side';
    
    Ext.BLANK_IMAGE_URL = 'resources/images/default/s.gif';
    
     
	/**************************** COMBOS END HERE ********************************************/					
				
				
     			//win.show();
				
			
				
				var freePortTypeForm = new Ext.FormPanel({
					labelAlign: 'right',
					labelWidth: 200,
					border:false,
					width:360,
					height:125,
					bodyStyle: 'padding:15px',
					waitMsgTarget: true,
					layout: 'absolute',
					items:[{
				                xtype: 'grid',
				             //   ds: ds,
				              /*  cm: colModel,
				                sm: new Ext.grid.RowSelectionModel({
				                    singleSelect: true,
				                    listeners: {
				                        rowselect: function(sm, row, rec) {
				                            Ext.getCmp("company-form").getForm().loadRecord(rec);
				                        }
				                    }
				                }),*/
				          //      autoExpandColumn: 'company',
				                height: 350,
				                title:'Company Data',
				                border: true,
				                listeners: {
				                 //   render: function(g) {
				                 //       g.getSelectionModel().selectRow(0);
				                 //   },
				                 //   delay: 10 // Allow rows to be rendered.
				                }
				          }]
					//items:[updatefieldset],
				});
				
				
				
				
    /**************************** FORM STARTS HERE ********************************************/
    
    
	     var serviceInfoForm = new Ext.FormPanel({
	       
	        labelWidth: 100, // label settings here cascade unless overridden
	        frame:true,
	        title: 'Cramer ISC - Set Port Details',
	        bodyStyle:'padding:5px 5px 0',
	        width: 650,
	        defaults: {xtype:'fieldset',anchor: '100%'},
	        defaultType: 'textfield',
			editable : false,
		items: [{
				title:'Enter Basic Customer Details',
				//defaultType:'textfield',
				defaults:{anchor:'80%'},
		        items: BasicCustomerDetails.util.BasicCustomerDetailsForm()
		         },
//		         {
//			        buttons:[
////			        	{
////		        		text: 'Get Ports By Location',
////		        		handler:  function(){
////		        			//Ext.getCmp('location_details-id').show();
////		        			Ext.getCmp('GetPortType-id').show();
////		        		}
////		       		 },
//		       		 {
//		        		text: 'Get Ports Directly',
//		        		handler:  function(){
//		        			
//							if(Ext.getCmp('serviceId-id').getValue() == '' || Ext.getCmp('customerName-id').getValue() == ''
//							|| Ext.getCmp('customerName-id').getValue() == '' )	{
//									Ext.MessageBox.alert('Failed', 'Service Details Are Mandatory'); 
//									
//							}else{
//							
//								// Check if the circuit already exists 
//								var IpPortType1 =  document.hiddenFields.hiddenIpTypeId.value;
//								
//								Ext.Ajax.request({
//													url : '../Wimax.cnms' , 
//													params : { serviceName : Ext.get('serviceId-id').dom.value,
//															   ipPortType : IpPortType1,
//															   method: 'checkCircuitExist' 
//															   
//															 },
//													method: 'POST',
//													success: function ( result, request ) { 
//													
//														if(result.responseText == "true")
//														{
//	 														   // Ext.getCmp('location_details-id').hide();
//				        										Ext.getCmp('GetPortType-id').show();
//														}
//														else
//														{
//														  Ext.MessageBox.alert('Failed', 'Circuit Already Exists For the Selected Service'); 
//														}
//													},
//													failure: function ( result, request) { 
//																//alert("failed == "+result.responseText);
//																Ext.MessageBox.alert('Failed', 'Circuit Already Exists'); 
//													} 
//												});
//								
//								
//		        			}
//		        		}
//		      		}]
//
//		        },
		        /*{
			        title:'Enter Location Details',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id: 'location_details-id',
					hidden: true,
					items: LocationDetails.util.LocationDetailsForm()

		        },*/{
			        title:'Select Port Type',
					//defaultType:'textfield',
					defaults:{anchor:'70%'},
					id: 'GetPortType-id',
					hidden: true,
					items: GetPortType.util.GetPortTypeForm()

		        },{
		        	title:'Special Service Required',
					defaultType:'textfield',
					defaults:{anchor:'60%'},
					id:'spl_service-id',
					hidden: true,
					items:[  
	          				  {
				                xtype: 'combo',
				                fieldLabel: 'Special Service Required',
				                id: 'spl_service_reqd-id',
				                name: 'spl_service_reqd',
			    	            triggerAction: 'all',
			    	            store :['VUTM','EAS'],	                    
			    	            allowBlank:false,
			    	            listWidth: 150,
			    	            listClass: 'x-combo-list-small'
	          				  }
	          			]
          		 },	{
		        	title:'WIMAX BTS Sector IP Address',
		        	id: 'wimax_bts_sector_ip_addr_fs-id',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					hidden: true,
					items:[		
		          		 		{
					                xtype: 'textfield',
					                fieldLabel: 'WIMAX BTS Sector IP Address',
					                id: 'wimax_bts_sector_ip_address-id',
					                name: 'wimax_bts_sector_ip_address'
		          				  }
		          		  ]
		          	},
		          	{
		        	title:'RADWIN Type',
					//defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'radwin_type_fs-id',
					hidden: true,
					items:[
		          			  {
				                xtype: 'combo',
				                fieldLabel: 'RADWIN Type',
				                id: 'radwin_type-id',
				                name: 'radwin_type',
			    	            triggerAction: 'all',
			    	            store :['Business Switch','Wimax Switch'],	                    
			    	            allowBlank:false
          					  }
          				  ]
          			},
          			{
		        	title:'NNI Name',
					defaultType:'textfield',
					id: 'nni_name_fs-id',
					defaults:{anchor:'70%'},
					hidden: true,
					items:[
								{
					                xtype: 'combo',
					                fieldLabel: 'NNI Name',
					                id: 'nni_name-id',
					                name: 'nni_name',
				    	            triggerAction: 'all',
				    	            store :['TULIP','AIRCEL'],	                    
				    	            allowBlank:false
          				 		 }
          				  ]
          			}/*,{
		        	buttons:[{
						text: 'Get Free Ports',
						handler: function(){
							
							if(Ext.getCmp('search-location-building-combo').value != ''){
								var portToLocation = Ext.getCmp('search-location-building-combo').value;
							}
							
							if(Ext.getCmp('search-location-area-combo').value != '' &&
								Ext.getCmp('search-location-building-combo').value == ''){
									var portToLocation = Ext.getCmp('search-location-area-combo').value;
							}
	
							if(Ext.getCmp('search-location-city-combo').value != '' &&
								Ext.getCmp('search-location-building-combo').value == '' && 
								Ext.getCmp('search-location-area-combo').value ==''){
									var portToLocation = Ext.getCmp('search-location-city-combo').value;
							}
							
							if(Ext.getCmp('search-location-state-combo').value != '' &&
								Ext.getCmp('search-location-city-combo').value == '' && 
								Ext.getCmp('search-location-building-combo').value =='' &&
								Ext.getCmp('search-location-area-combo').value ==''){
									var portToLocation = Ext.getCmp('search-location-state-combo').value;
							}
							
							if(Ext.getCmp('search-location-country-combo').value != '' &&
								Ext.getCmp('search-location-state-combo').value == '' && 
								Ext.getCmp('search-location-city-combo').value =='' &&
								Ext.getCmp('search-location-building-combo').value ==''){
									var portToLocation = Ext.getCmp('search-location-country-combo').value;
							}
						
							
							win = 	new Ext.Window({
					           		title: 'Free Ports',
							        closeAction: 'hide',
					     	        defaultType: 'textfield',
					     	        items: [freePortTypeForm]
     	   					});
     						win.show();
							
						}
					}]
          			}*/
					,
		        {
			        title:'Serial (V.35)',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase0',
					hidden: true//,
					///items: Serial_V_35.util.Serial_V_35_Form()
		        },
		        {
			        title:'Serial (G.703)',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase1',
					hidden:true
					
		        },
		        {
			        title:'Serial CHANL STM1 KLM Based',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase2',
					hidden:true
					
		        },
		        {
			        title:'FastEthernet Directly on Router',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase3',
					hidden:true
					
		        },
		        {
			        title:'FastEthernet on Business Switch',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase4',
					hidden:true
					
		        },
		        {
			        title:'GigabitEthernet directly on Router',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase5',
					hidden:true
					
		        },
		        {
			        title:'GigabitEthernet on Business Switch',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase6',
					hidden:true
					
		        }/*,
		        {
			        title:'WIMAX',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase7',
					hidden:true
					
		        }*/,
		        {
			        title:'RADWIN-Business Switch',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase8',
					hidden:true
					
		        },
		        {
			        title:'RADWIN-WIMAX Switch',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase9',
					hidden:true
					
		        },
		        {
			        title:'NNI',
					defaultType:'textfield',
					defaults:{anchor:'70%'},
					id:'portTypeCase10',
					hidden:true
					
		        }]
		        
	    });
	    
    
    serviceInfoForm.render(document.body);
    
     /**************************** FORM ENDS HERE ********************************************/
    
})