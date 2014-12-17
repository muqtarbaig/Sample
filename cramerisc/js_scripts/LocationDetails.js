	LocationDetails = {};
	
		var selectedCountry = "";
		var selectedState = "";
		var selectedCity = "";
		var selectedArea = "";
		var selectedBuilding = "";
    	var nodeToLocation="";
    	
    	 var addLocationStore = new Ext.data.JsonStore({
	    	url: '../GetComboJson.cnms',
	    	baseParams:{comboId:'locationCombo'},
	    	fields: [
	    	    {name: 'combovalue'},
	    	    {name: 'comboid'}
	    	]
	    });
    	
    	 var countryStore = new Ext.data.JsonStore({
		    	url: '../GetComboJson.cnms',
		    	baseParams:{comboId:'countryCombo'},
		    	fields: [
		    	    {name: 'combovalue'},
		    	    {name: 'comboid'}
		    	]
	    });
	    
	    var stateStore = new Ext.data.JsonStore({
	    	url: '../GetComboJson.cnms',
	    	baseParams:{comboId:'stateCombo',countryname:''},
	    	fields: [
	    	    {name: 'combovalue'},
	    	    {name: 'comboid'}
	    	]
	    });

	    var cityStore = new Ext.data.JsonStore({
	    	url: '../GetComboJson.cnms',
	    	baseParams:{comboId:'cityCombo',countryname:'',statename:''},
	    	fields: [
	    	    {name: 'combovalue'},
	    	    {name: 'comboid'}
	    	]
	    });

	    var areaStore = new Ext.data.JsonStore({
	    	url: '../GetComboJson.cnms',
	    	baseParams:{comboId:'areaCombo',countryname:'',statename:'',cityname:''},
	    	fields: [
	    	    {name: 'combovalue'},
	    	    {name: 'comboid'}
	    	]
	    });

	    var buildingStore = new Ext.data.JsonStore({
	    	url: '../GetComboJson.cnms',
	    	baseParams:{comboId:'buildingCombo',countryname:'',statename:'',cityname:'',areaname:''},
	    	fields: [
	    	    {name: 'combovalue'},
	    	    {name: 'comboid'}
	    	]
	    });
    	 
    	var floorStore = new Ext.data.JsonStore({
	    	url: '../GetComboJson.cnms',
	    	baseParams:{comboId:'floorCombo'},
	    	fields: [
	    	    {name: 'combovalue'},
	    	    {name: 'comboid'}
	    	]
	    });
    	 
    	 
    /*	 
    	 var getLocationTypeCombo = new Ext.form.ComboBox ({
		    	       //     xtype:'combo',
		    	            name:'locationType',
		    	            id:'add-location-type',
		    	            fieldLabel:'Location Type',
		    	            store :['country','state','city','area','building'],	                    
		    	            //anchor:'70%',
		    	            allowBlank:false,
		    	            listWidth: 150,
		    	            listeners:{
	    	            		'select':function(combo, value) {
									var locationType = Ext.getCmp('add-location-type').getValue();
									addLocationStore.setBaseParam('query','NONE');
									addLocationStore.setBaseParam('locationType',locationType);
									addLocationStore.load();
		                        }
	                    }
	    	        })
    	 */
    
	    var getCountryCombo = new Ext.form.ComboBox({
	    				name:'searchLocationCountry',	
	    	            id:'search-location-country-combo',				    	           
	    	            fieldLabel:'Country',
	    	            store :countryStore,
	    	            mode :'remote',
	    	            minChars:2,
	    	            displayField:'combovalue',
	    				valueField:'comboid',
	    				hiddenName: 'countryId',
	    	            anchor:'70%',
	    	            listWidth: 300,
	    	            listeners:{
    	            		'select':function(combo, value) {
								selectedCountry = getComboDisplayText(this.id,this.store,this.valueField,this.displayField);																	
								stateStore.setBaseParam('countryname',selectedCountry);
								cityStore.setBaseParam('countryname',selectedCountry);
								areaStore.setBaseParam('countryname',selectedCountry);
								buildingStore.setBaseParam('countryname',selectedCountry);
								//document.getElementById('search-location-id').value = this.getValue();
								
								//Ext.getCmp('add-location-type').setValue('country');
								addLocationStore.setBaseParam('query',selectedCountry);
								addLocationStore.setBaseParam('locationType','country');
								nodeToLocation = Ext.getCmp('search-location-country-combo').value;
								addLocationStore.on('load',function(){
									alert(" nodeToLocation "+nodeToLocation);
									//Ext.getCmp('add-location-name').setValue(combo.getValue());
								});
								
							}
						}
					})
    
	    var getStateCombo = new Ext.form.ComboBox({
    						name:'searchLocationState',	
		    	            id:'search-location-state-combo',						    	           
		    	            fieldLabel:'State',
		    	            store :stateStore,
		    	            mode :'remote',
		    	            minChars:2,
		    	            displayField:'combovalue',
		    				valueField:'comboid',
		    				hiddenName: 'stateId',
		    	            anchor:'70%',
   	    	                listWidth: 300,
		    	            listeners:{
	    	            		'select':function(combo, value) {
	    	            		
									selectedState = getComboDisplayText(this.id,this.store,this.valueField,this.displayField);
//									stateStore.setBaseParam('countryname','');
									cityStore.setBaseParam('statename',selectedState);
									areaStore.setBaseParam('statename',selectedState);
									buildingStore.setBaseParam('statename',selectedState);
								//	document.getElementById('search-location-id').value = this.getValue();
									
								//	Ext.getCmp('add-location-type').setValue('state');
									addLocationStore.setBaseParam('query',selectedState);
									addLocationStore.setBaseParam('locationType','state');
									nodeToLocation = Ext.getCmp('search-location-state-combo').value;
									addLocationStore.on('load',function(){
									//	Ext.getCmp('add-location-name').setValue(combo.getValue());
									});
									addLocationStore.load();
								}
							}
				})
				
				
				var getCityCombo = new Ext.form.ComboBox({
    						name:'searchLocationCity',	
		    	            id:'search-location-city-combo',						    	           
		    	            fieldLabel:'City',
		    	            store :cityStore,
		    	            mode :'remote',
		    	            minChars:2,
		    	            displayField:'combovalue',
		    				valueField:'comboid',
		    				hiddenName: 'cityId',
		    	            anchor:'70%',
		    	            listWidth: 300,
		    	            listeners:{
	    	            		'select':function(combo, value) {
									selectedCity = getComboDisplayText(this.id,this.store,this.valueField,this.displayField);
									areaStore.setBaseParam('cityname',selectedCity);
									buildingStore.setBaseParam('cityname',selectedCity);
								//	document.getElementById('search-location-id').value = this.getValue();
								//	Ext.getCmp('add-location-type').setValue('city');
									addLocationStore.setBaseParam('query',selectedCity);
									addLocationStore.setBaseParam('locationType','city');
									nodeToLocation = Ext.getCmp('search-location-city-combo').value;
									addLocationStore.on('load',function(){
									//Ext.getCmp('add-location-name').setValue(combo.getValue());
										});
										addLocationStore.load();
								}
							}
				})
    			
    			
    			var getAreaCombo = new Ext.form.ComboBox({
    						name:'searchLocationArea',	
		    	            id:'search-location-area-combo',						    	           
		    	            fieldLabel:'Area',
		    	            store :areaStore,
		    	            mode :'remote',
		    	            minChars:2,
		    	            displayField:'combovalue',
		    				valueField:'comboid',
		    				hiddenName: 'areaId',
		    	            anchor:'70%' ,
  		    	            listWidth: 300,
		    	            listeners:{
	    	            		'select':function(combo, value) {
									selectedArea = getComboDisplayText(this.id,this.store,this.valueField,this.displayField);
									buildingStore.setBaseParam('areaname',selectedArea);
									//document.getElementById('search-location-id').value = this.getValue();

									//Ext.getCmp('add-location-type').setValue('area');
									addLocationStore.setBaseParam('query',selectedArea);
									addLocationStore.setBaseParam('locationType','area');
									nodeToLocation = Ext.getCmp('search-location-area-combo').value;
									addLocationStore.on('load',function(){
										//Ext.getCmp('add-location-name').setValue(combo.getValue());
									});
									addLocationStore.load();
									}
							}
				})
				
				
				var getBuildingCombo = new Ext.form.ComboBox({
	    						name:'searchLocationBuilding',	
			    	            id:'search-location-building-combo',					    	           
			    	            fieldLabel:'Building',
			    	            store :buildingStore,
			    	            mode :'remote',
			    	            minChars:2,
			    	            displayField:'combovalue',
			    				valueField:'comboid',
			    				hiddenName: 'buildingId',
			    	            anchor:'70%',
			    	            listWidth: 300, 
			    	            listeners:{
		    	            		'select':function(combo, value) {
										selectedBuilding = getComboDisplayText(this.id,this.store,this.valueField,this.displayField);
										Ext.getCmp('floor-id').clearValue();
										floorStore.setBaseParam('QUERY',selectedBuilding);
										//document.getElementById('search-location-id').value = this.getValue();
									
									//	Ext.getCmp('add-location-type').setValue('building');
										addLocationStore.setBaseParam('query',selectedBuilding);
										addLocationStore.setBaseParam('locationType','building');
										nodeToLocation = Ext.getCmp('search-location-building-combo').value;
										addLocationStore.on('load',function(){
											//Ext.getCmp('add-location-name').setValue(combo.getValue());
										});
										addLocationStore.load();
										
									}
								}      
				})
				
				
				
				var getFloorCombo= new Ext.form.ComboBox({     
//										xtype:'combo',
					    	            name:'floor',
					    	            id:'floor-id',
					    	            fieldLabel:'Floor',
					    	            triggerAction: 'all',
					    	            store : floorStore,
					    	            anchor:'70%',
					    	            listWidth: 300,
					    	            allowBlank:false,
					    	            displayField:'combovalue',
					    				valueField:'comboid'
	    	     		   })
	

	
		function getComboDisplayText(comboId,comboStore,valueField,displayField){
					var idx = comboStore.findExact(valueField,Ext.getCmp(comboId).getValue());
					return comboStore.getAt(idx).get(displayField);
				}
	
	LocationDetails.util = function() { 
			    return {
					 LocationDetailsForm : function(){
						return	[ //getLocationTypeCombo,
								   getCountryCombo,
								   getStateCombo,
								   getCityCombo,
								   getAreaCombo,
								   getBuildingCombo//,
								  // getFloorCombo //,
								 //  getPortTypeCombo
						  ]
							
					}
		 }
	}();
		