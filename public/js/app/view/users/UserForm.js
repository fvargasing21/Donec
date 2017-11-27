Ext.define('Admin.view.users.UserForm', {
	extend: 'Ext.form.Panel',
	alias: ['widget.userform'],
	requires: [
	    'Admin.view.users.UsersController'
    ],
	layout:'column',                                                
    bodyPadding: '5 5 0',                           
    defaults: {                             
        layout:'anchor'
    },                          
    defaultType: 'textfield',
    fieldDefaults: {
        labelAlign: 'left',
        labelWidth: 80,
        msgTarget: 'side',
        layout: 'anchor',
        columnWidth:1,
        margin:5                            
    },
    buttonAlign:'rigth', 
    controller: 'users-users',
	viewModel: {
        type: 'groups-groups'
    },
	items:[
		{
			xtype: 'hiddenfield',
			name: 'id'
		},
		{
			xtype: 'textfield',
			name: 'username',
			emptyText: 'Usuario'
		},
		{
			xtype: 'textfield',
			name: 'email',
			vtype: 'email', 
			emptyText: 'Correo'
		},
		{
			xtype: 'combo',
			name: 'usergroup',
			emptyText: 'Grupo',
			bind:{
				store: '{groupstore}',
			},
			triggers: {
		        add: {
		        	cls:"x-form-trigger-default x-form-add-trigger",
		            handler:'onAddGroup'
		        }
	    	},
			queryMode: 'local',
		    displayField: 'name',
		    valueField: 'id'
		}
	],
	buttons:[
	    {
	        xtype:'button',
	        text:'Guardar',
	        name:'guardar',
	        iconCls:'save-icon',
	        formBind:true,                         
	        handler:'guardar',
	        cls: 'ux-action-btn'
	    },
	    {
	        xtype:'button',
	        text:'Cancelar',
	        iconCls:'cancel-icon',
	        cls:'btn btn-large',                          
	        handler:function(self){
	             self.up('window').close();
	        },
	        cls: 'ux-action-btn'
	    }
	],
	listeners:{
		afterrender:function(self){
			if(typeof(self.record)!='undefined'){
				self.loadRecord(self.record);
			}
		}
	}
});