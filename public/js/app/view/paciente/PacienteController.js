Ext.define('Admin.view.paciente.PacienteController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.paciente-paciente',
    search:function(self){
    	var grid=self.up("grid"),
    	params={},
    	toolbar=grid.down('toolbar[dock=top]'),
    	valid=true;
    	Ext.Array.each(toolbar.query('field'),function(item,index){
    		/*if(!item.isValid()){
    			valid=false;
    		}*/
    		if(item.getSubmitValue()!=null && item.getSubmitValue()!=''){
    			params[item.name]=item.getSubmitValue();
    		}
    	});
    	if(valid){
    		params["estado"] = 0;
    		grid.getStore().getProxy().extraParams=params;
    		grid.getStore().loadPage(1);
    	}else{
    		Ext.Msg.show({
    		    title: 'Atención',
    		    msg: 'Algunos campos son requeridos.',
    		    buttons: Ext.Msg.OK,
    		    icon: Ext.Msg.WARNING                    
    		});
    	}
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
    },
    upload:function(grid, rowIndex, colIndex){
    	var record = grid.getStore().getAt(rowIndex);
        record.set("estado",1);
        console.log("Se va a subir. ",record.getData())
        record.save({
            callback: function(record, operation, success) {
                var responseObject = Ext.decode(operation.getResponse().responseText);
                // do something whether the save succeeded or failed
                if(!success){
                    Ext.Msg.show({
                        title: 'Atención',
                        msg: responseObject.msg,
                        buttons: Ext.Msg.OK,
                        icon: Ext.Msg.ERROR                    
                    });
                }else{
                    var paciente = responseObject.paciente;
                    var params = paciente;
                    console.log(paciente);
                    Msg.info(responseObject.msg);

                    grid.getStore().reload();
                }
            }
        });
    },
    onSaveEnter:function(self, e){
       var me =this;
       if (e.getKey() == e.ENTER) {
         me.update(self,e);
       }
    },
    update:function(self,e){ 
       var grid = self.up("grid");
       var store = grid.getStore();
       var records=store.getUpdatedRecords();
       if(records.length>0){
           var record = records[0];
           record.set(self.name,self.getValue()); 
           record.save({
               callback: function(record, operation, success) {
                   var responseObject = Ext.decode(operation.getResponse().responseText);
                   // do something whether the save succeeded or failed
                   if(!success){
                       Ext.Msg.show({
                           title: 'Atención',
                           msg: responseObject.msg,
                           buttons: Ext.Msg.OK,
                           icon: Ext.Msg.ERROR                    
                       });
                   }else{
                       var paciente = responseObject.paciente;
                       var params = paciente;
                       console.log(paciente);
                       //Msg.info(responseObject.msg);

                       grid.getStore().reload();
                   }
               }
           });
       }
    },
    nuevo:function(self){
      var grid = self.up("grid");
      Ext.create('Ext.window.Window', {
          title: 'Datos del Paciente',
          width: 400,
          layout: 'fit',
          modal: true,
          constrainHeader: true,
          resizable: false,
          items: [
            Ext.create('Admin.view.paciente.pacienteForm',{
              grid:grid
            })
          ]
      }).show();
    },
    onSelect:function(grid, record, index){
      var me = this.getView(),
      form = me.down("form"),
      grid = me.down("grid");
      console.log(me,form,record);
      form.getForm().loadRecord(record)
    }
});
