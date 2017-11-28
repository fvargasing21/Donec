Ext.define('Admin.view.paciente.pacienteForm', {
	extend: 'Ext.form.Panel',
	alias: ['widget.pacienteform'],
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
        columnWidth:.5,
        margin:5                            
    },
    buttonAlign:'rigth',                         
    autoScroll: true, 
	initComponent: function() {
		var me = this;
		Ext.apply(me, {

			items:[
				{
					xtype: 'hiddenfield',
					name: 'id'
				},
				{
				    name: "nombre",
				    emptyText:"Nombre",
				    allowBlank:false
				},
				{
				    name: "apellido",
				    emptyText:       "Apellido",
				    allowBlank:false
				},
				{
				    name: "documento",
				    emptyText:       "Documento",
				    allowBlank:false
				},
				{
				    name: "direccion",
				    emptyText:       "Direccion",
				},
				{
				    name: "localidad",
				    emptyText:       "Localidad",
				},
				{
				    name: "provincia",
				    emptyText:       "Provincia",
				},
				{
					xtype: 'datefield',
					name: 'fecha_nacimiento',
					emptyText: 'Fecha nacimiento'
				},
				{
					xtype: 'combo',
					name: 'sexo',
					emptyText: 'Sexo',
					store: Ext.create('Ext.data.Store', {
					    fields: ['value', 'name'],
					    data : [
					        {"value":"M", "name":"Masculino"},        
					        {"value":"F", "name":"Femenino"}        
					    ]
					}),
					queryMode: 'local',
				    displayField: 'name',
				    valueField: 'value'
				},
				{
				    name: "telefono",
				    emptyText: "Telefono",
				},
				{
				    name: "diagnostico",
				    emptyText:"Diagnóstico",
				    xtype: 'textarea',
				    grow: true
				},
				{
					xtype: 'datefield',
					name: 'fecha_ingreso',
					value:new Date(),
					emptyText: 'Fecha ingreso'
				},
				{
					xtype: 'datefield',
				    name: "fecha_alta",
				    emptyText:"Fecha_alta"
				}	
			],
			buttons:[
			    {
			        xtype:'button',
			        text:'Guardar',
			        name:'guardar',
			        iconCls:'save-icon',
			        scope:me,
			        formBind:true,                         
			        handler:me.guardar,
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
		me.callParent(arguments);
	},
	guardar:function(self){
		var me=this,
		form=self.up('form'),
		grid = form.up().down("grid");
		if(form.getForm().isValid()){
			form.getForm().submit({
				url:Constants.URL_PACIENTE,
				scope: this,
				submitEmptyText : false,		
				success: function(f, action) {


					grid.getStore().reload();
					
					Ext.Msg.show({
					    title: 'Aviso',
					    msg: action.result.msg,
					    buttons: Ext.Msg.OK,
					    icon: Ext.Msg.INFO,
					    fn:function(){
					    	form.getForm().reset();
					    }                    
					});
				},
				failure: function(f, action) {
					Ext.Msg.show({
					    title: 'Error',
					    msg: 'Error en la petición',
					    buttons: Ext.Msg.OK,
					    icon: Ext.Msg.ERROR                    
					});
				}
			});
		}else{
			Ext.Msg.show({
			    title: 'Atención',
			    msg: 'Algunos datos son requeridos',
			    buttons: Ext.Msg.OK,
			    icon: Ext.Msg.ERROR                    
			});
		}
	}
});	