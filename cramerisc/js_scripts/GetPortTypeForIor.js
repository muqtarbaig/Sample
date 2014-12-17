GetPortType = {};


//var nodeToLocation="";

var portTypeStore = new Ext.data.JsonStore({
	    	url: '../GetComboJson.cnms',
	    	baseParams:{comboId:'portTypeComboForIor'},
	    	fields: [
	    	    {name: 'combovalue'},
	    	    {name: 'comboid'}
	    	]
	    });


GetPortType.util = function() { 
		    return {
				 GetPortTypeForm : function(){
					return	[{
										xtype:'combo',
					    	            name:'portType',
					    	            id:'portType-id',
					    	            fieldLabel:'Port Type',
					    	            triggerAction: 'all',
					    	            editable : false,
					    	            store :	portTypeStore,	
										displayField:'combovalue',
					    				valueField:'comboid',					    	            			                    
					    	            anchor:'85%',
					    	            listWidth: 450,
					    	            allowBlank:false,
					    	            listeners: {
					    	            	select : function(ComboBox, record, index){
					    	            	
												var portType = Ext.getCmp('portType-id').value;
												
												alert(portType);
												
					    	            		var j=10;
					    	            		
					    	            		 if(portType == 'Switch <--> Switch')
					    	            			 {
					    	            			 
					    	            			 }
							    	            	 // wimaxWin.show();
							    	        	
						    	            	 if(portType == 'Router <--> Switch')	
						    	            		{
						    	            		 
						    	            		}
						    	            		// nniWin.show();
						    	            	 
						    	            	 if(portType == 'Router <--> Router')	
						    	            		 {
						    	            		 
						    	            		 }
						    	            	//	 ethWOTxWTopoWin.show();
						    	            	 
						    	            	 if(portType == 'Router <--> Cloud')	
						    	            	 {
						    	            		 RouterCard.show();
						    	            	 }
						    	            	 
						    	            	 if(portType == 'Router <--> Switch <--> Cloud')
						    	            		{
						    	            		 
						    	            		}
						    	            	//	 ethBearerTxWin.show();
						    	            		 
						    	            	 if(portType == 'Only VLAN and IP Reservation')
						    	            		 {
						    	            		 
						    	            		 }
						    	            	//	ethWOTxNOVlanWin.show();
						    	            	 
						    	            	 if(portType == 'Aggregation Switch to BTS Switch Wimax CLR')
						    	            		 {
						    	            		 
						    	            		 }
						    	            	//	ethWithTxNOVlanWin.show();
						    	            	 
						    	            
						    	            	
						    	            }
					    	            }
						}]
				}
	 }
}();
	