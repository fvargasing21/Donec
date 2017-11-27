
Ext.define('Admin.view.preferences.Preferences',{
    extend: 'Ext.form.Panel',
    xtype:'preference',
    requires: [
        'Admin.view.preferences.PreferencesController',
        'Admin.view.preferences.PreferencesModel'
    ],
    controller: 'preferences-preferences',
    viewModel: {
        type: 'preferences-preferences'
    },
    items:[
        {
            xtype:'tabpanel',
            // layout:'card',
            defaults:{
                defaultType:'textfield',
                anchor: '100%'
            },
            bodyPadding: 10,    
            layout: 'anchor',
            items:[
                {
                    title:'Dispositivo',
                    defaults:{
                        labelAlign:'top',
                        width:'100%'
                    },
                    items:[
                        {
                            xtype: 'combo',
                            name: 'organismo',
                            fieldLabel: 'Organismo',
                            bind:{
                                store:'{organismostore}'
                            },
                            allowBlank : false,
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'codigo',
                            emptyText:'Selecione Organismo',
                            listeners:{
                                select:function(self, record, eOpts){
                                    var form = self.up("form");
                                    var camara = form.down("[name=camera_id]");
                                    camara.reset();
                                    camara.getStore().getProxy().extraParams = record.getData();
                                    camara.getStore().load();
                                }
                            }
                        },
                        {
                            xtype: 'combo',
                            name: 'camera_id',
                            fieldLabel: 'Camara',
                            emptyText:'Selecione Dispositivo',
                            bind:{
                                store:'{dispositivostore}'
                            },
                            queryMode: 'local',
                            displayField: 'name',
                            valueField: 'codigo',
                            allowBlank : false
                        }
                    ]
                },
                {
                    title:'Camara',
                    defaults:{
                        labelAlign:'top',
                        width:'100%'
                    },
                    items:[
                        { 
                            name:'username',
                            xtype:'hiddenfield'
                        },
                        { 
                            name:'email',
                            xtype:'hiddenfield'
                        },
                        { 
                            name:'camera_ip',
                            fieldLabel:'Camara IP',
                            regex: /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                            regexText: 'Debe ser una dirección IP Válida.'
                        },
                        { 
                            name:'camera_user',
                            fieldLabel:'Usuario Camara'
                        },
                        { 
                            name:'camera_password',
                            fieldLabel:'Contraseña Camara'
                        }
                    ]
                },
                {
                    title:'Carrito',
                    defaults:{
                        labelAlign:'top',
                        width:'100%'
                    },
                    items:[
                        { 
                            name:'movil_plate',
                            fieldLabel:'Placa'
                        },
                        { 
                            name:'movil_name',
                            fieldLabel:'Nombre Vehiculo'
                        }
                    ]
                }
            ]
        }
    ],
    buttons: [
        {
            text: 'Guardar',
            formBind: true, 
            disabled: true,
            handler: function(self) {

                var form = self.up('form');

                if (form.isValid()) {
                    form.submit({
                        url:Constants.URL_CONFIG_APP,
                        waitMsg: 'Procesando solicitud...',
                        success: function(f, action) {
                        
                            Ext.Msg.show({
                                title: 'Información',
                                msg: action.result.msg,
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.INFO                    
                            });
                        },
                        failure: function(f, action) {

                            Ext.Msg.show({
                                title: 'Error',
                                msg: action.result.msg,
                                buttons: Ext.Msg.OK,
                                icon: Ext.Msg.ERROR                    
                            });
                        }
                    });
                }
            }
        }
    ],
    listeners:{
        afterrender:function(self){
            Ext.Ajax.request({
                scope: this,
                url: Constants.URL_CONFIG_APP,
                success: function(response) {
                    var responseObject = Ext.decode(response.responseText);
                    if("config" in responseObject){
                        var config = responseObject.config;
                        var params ={};
                        for(var key in config){
                            if(typeof(config[key])=='object'){
                                for(var s in config[key]){
                                    params[s] = config[key][s];
                                }
                            }else{
                                params[key] = config[key];
                            }
                        }
                        var preferences = Ext.create('Admin.model.preferences.Preferences',params);
                        self.loadRecord(preferences);
                    }       
                },
                failure: function(response) {
                    Ext.Msg.show({
                        title: 'Error',
                        msg: 'Error al procesar la petición.',
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR
                    });
                }
            });

            
        }
    }
});
/*
layout:'column',                                                
bodyPadding: '5 5 0',                           
defaults: {                             
    layout:'anchor'
},                          
defaultType: 'textfield',
fieldDefaults: {
    labelAlign: 'top',
    labelWidth: 80,
    msgTarget: 'side',
    layout: 'anchor',
    columnWidth:1,
    margin:5                            
},
*/