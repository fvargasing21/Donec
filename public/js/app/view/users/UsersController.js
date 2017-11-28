Ext.define('Admin.view.users.UsersController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.users-users',
    onEditar:function(self){

    },
    onAddGroup:function(self){
        Ext.Msg.prompt('Nuevo Grupo', 'Nombre de Grupo:', function(btn, text){
            if (btn == 'ok'){
                Ext.Ajax.request({
                    scope: this,
                    method:"POST",
                    url: Constants.URL_GROUPS,
                    params: {
                        name:text
                    },
                    success: function(response) {
                        var responseObject = Ext.decode(response.responseText);
                        Ext.Msg.show({
                            title: 'Aviso',
                            msg: responseObject.msg,
                            buttons: Ext.Msg.OK,
                            icon: Ext.Msg.INFO,
                            fn:function(){
                                self.getStore().reload();
                            }                    
                        });        
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
        });
    },
    onNew:function(self){
    	var me = this;
    	var grid = self.up("grid");
    	Ext.create('Ext.window.Window', {
    	    title: 'Crear Usuario',
    	    width: 400,
    	    layout: 'fit',
    	    modal: true,
    	    constrainHeader: true,
    	    resizable: false,
    	    items: [
    			{
    				xtype:'userform',
    				grid:grid,
    				scope:me
    			}
    	    ]
    	}).show();
    },
    onEdit: function(grid, rowIndex, colIndex) {
    	var me = this;
        var record = grid.getStore().getAt(rowIndex);

        console.log(record);

    	Ext.create('Ext.window.Window', {
    	    title: 'Actualizar Usuario',
    	    width: 400,
    	    layout: 'fit',
    	    modal: true,
    	    constrainHeader: true,
    	    resizable: false,
    	    items: [
    			{
    				xtype:'userform',
    				grid:grid,
    				record:record,
    				scope:me
    			}
    	    ]
    	}).show();
    },
    onRemove: function(grid, rowIndex, colIndex) {
    	var me = this;
        var record = grid.getStore().getAt(rowIndex);

        console.log(record);
        Ext.Msg.confirm('Atención', 'Desea eliminar el usuario?', function(buttonId, text, v) {
        	if(buttonId == 'yes') {
        		Ext.Ajax.request({
        			scope: this,
        			method:"DELETE",
        			url: Constants.URL_USUARIOS,
        			params: {
        				id:record.get("id")
        			},
        			success: function(response) {
        				var responseObject = Ext.decode(response.responseText);
        				grid.getStore().reload();
        				Ext.Msg.show({
        				    title: 'Aviso',
        				    msg: responseObject.msg,
        				    buttons: Ext.Msg.OK,
        				    icon: Ext.Msg.INFO                    
        				});		
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
        }, this);
    },
    guardar:function(self){
		var me=this,
		form=self.up('form');
		if(form.getForm().isValid()){
			form.getForm().submit({
				url:Constants.URL_USUARIOS,
				submitEmptyText : false,		
				success: function(f, action) {
					if(form.grid!=undefined){form.grid.getStore().reload();}
					self.up('window').close();
					Ext.Msg.show({
					    title: 'Aviso',
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
		}else{
			Ext.Msg.show({
			    title: 'Atención',
			    msg: 'Algunos datos son requeridos',
			    buttons: Ext.Msg.OK,
			    icon: Ext.Msg.ERROR                    
			});
		}
	},
	search:function(self){
		var grid=self.up("grid"),
		params={},
		toolbar=grid.down('toolbar[dock=top]');
		Ext.Array.each(toolbar.query('field'),function(item,index){
			if(item.getValue()!=''){
				params[item.name]=item.getValue();
			}
		});
		grid.getStore().getProxy().extraParams=params;
		grid.getStore().loadPage(1);
	},
	limpiar:function(self){
		var grid=self.up("grid"),
		params={},
		toolbar=grid.down('toolbar[dock=top]');
		Ext.Array.each(toolbar.query('field'),function(item,index){
		    item.reset();
			params[item.name]=item.getValue();
		});
		grid.getStore().getProxy().extraParams=params;
		// grid.getStore().loadPage(1);
		grid.getStore().removeAll();
	}	
});
