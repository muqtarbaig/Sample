Ext.onReady(function() {

	var mystore = new Ext.data.store({
		
		field : ['Red', 'blue']
		
		
	});

	var myForm = new Ext.form.FormPanel({
		title : 'My first form',
	//	baseCls: 'x-plain',
		items : [

		         {
		        	 xtype: 'textfield',
		        	 fieldLabel : 'Name'
		         },
		         
		         
		        	 new Ext.form.TextField({
		        			fieldLabel: 'Emp Name',
		        			name: 'name',
		        			width:190
		        		}),
		        		
		        		
		        {
		        	 xtype : 'combo',
		        	 fieldLabel : 'comboxx',
		        		 store : mystore
		        }	 	
		        		
		         

		         ]
	});

	var win = new Ext.Window({

		title : 'my window',
		width: 750,
		height: 500,
		maximizable : true,
		minWidth: 300,
		minHeight: 200,
		layout: 'fit',
		items : [myForm],
		buttons : [
		           {
		        	   text : 'submit-1',
		        	   handler : function(){
		        		   Ext.Msg.alert('Button clicked');
		        	   }
		           }
		           ]

	});

	win.show();

});
