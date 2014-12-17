GetPortType = {};


//var nodeToLocation="";

var portTypeStore = new Ext.data.JsonStore({
	    	url: '../GetComboJson.cnms',
	    	baseParams:{comboId:'portTypeCombo'},
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
												
					    	            		var j=10;

					    	            		 if(portType == 'WIMAX')
							    	            	 wimaxWin.show();
					    	            		 
					    	            		 if(portType == 'WIMAX (CISCO/Juniper/ALU)')
							    	            	 wimaxForALUWin.show();

						    	            	 if(portType == 'NNI')
						    	            		 nniWin.show();
						    	            	 
						    	            	 if(portType == 'NNI (CISCO/Juniper/ALU)')
						    	            		 nniForALUWin.show();

						    	            	 if(portType == 'Scenario 7: Ethernet On Switch: Without Transmission Layer, With Topology')
						    	            		 ethOnSwWOTWin.show();
						    	            

						    	            	 if(portType == 'Scenario 8: Ethernet On Switch: With Transmission Layer, With Topology')
						    	            		 ethOnSwWTxWin.show();

						    	            	 if(portType == 'Scenario 6: Ethernet On Router: Without Transmission')
						    	            		ethOnRouterWOTx.show();
						    	            	 
						    	            	 if(portType == 'ETHERNET (CISCO/JUNIPER/ALU)')
						    	            		  ethScenario.show();
						    	            	 
						    	            	 if(portType == 'Scenario 5: Ethernet On Router: With Transmission')
						    	            		ethOnRouterWTxWin.show();

						    	            	 if(portType == 'Scenario 1: PDH V.35')
						    	            		 pdhV35Win.show();

						    	            	 if(portType == 'Scenario 2: PDH G.703')
						    	            		 pdhG703Win.show();
						    	            	 
						    	            	 if(portType == 'Scenario 2A: PDH - Dedicated E1')
						    	            		 pdhG703DedicatedE1Win.show();

						    	            	 if(portType == 'Scenario 3: Serialized - Channelized STM1- with KLM')
						    	            		 serialchanlSTMKLMWin.show();

						    	            	 if(portType == 'Scenario 4: POS Port - Direct to Router')
						    	            		 posPortDirectToRouterWin.show();
						    	            	 
						    	            	 if(portType == 'Shared LM and CPE')
						    	            		multipleVlanUpgradeWin.show();
						    	            
						    	            	 if(portType == 'RADWIN AS POP')
						    	            		 radwinPOPWin.show();
						    	            	 
						    	            	 if(portType == 'ELAN')
													 elanWin.show();
						    	            	   
						    	            	 if(portType == 'Scenario 3A: Dedicated E1 over Channelized STM1')
                                                  DedicatedE1OverChanWin.show();
                                                               
                                                 if(portType == 'Scenario 3B: N x 64K Dedicated E1 over Channelized STM1')
                                                 DedicatedE1OverChanStm1Win.show();

                                                              
                                                 if(portType == 'Scenario 2B: N X 64K Dedicated E1')
                                                 N64KDedicatedE1Win.show();
 
						    	            	    
						    	            	  if(portType == 'ELAN04 CARD')
						    	            		 elan04cardWin.show();
						    	            	 
						    	            	 if(portType == 'SME Connectivity For MPLS')
						    	            		 smeWin.show();
						    	            	 
						    	            	 if(portType == 'Road Warrior')
						    	            		 roadWarriorWin.show();
						    	            	 
						    	            	 if(portType == 'vUTM')
						    	            		 vutmWin.show();
						    	       
						    	               	 if(portType == 'ACCESS')
						    	            		 accessWin.show();
						    	               	 
						    	               	 if(portType == 'IntraCity/IntraRing')
						    	            		 intracityIntraringWin.show();
						    	            }
					    	            }
						}]
				}
	 }
}();
