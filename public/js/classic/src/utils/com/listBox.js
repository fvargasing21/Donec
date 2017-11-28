
/**
 * @class MyDesktop.util.com.comboDonec
 * @extends Ext.form.ComboBox
 * Description
 */


Ext.define('Admin.utils.com.listBox', {
        extend: 'Ext.form.field.ComboBox',       
        alias:'widget.listBox',                         
        fieldLabel: '',        
    	displayField: '',
    	valueField: '',
        // forceSelection:true,
        //forceSelection:true, (NO USAR POR DEFECTO)
        //         // selectOnFocus: true,
        enableKeyEvents:true,
        triggerAction:'query',			            
        typeAhead: true,
        // typeAheadDelay:0,				                        
        store:null,
        valid:true,
        anyMatch:true,
        queryMode: 'local',
        triggerCls:'x-form-search-trigger',
        trigger1Cls: Ext.baseCSSPrefix + 'form-clear-trigger',
        /*trigger2Cls: Ext.baseCSSPrefix + 'form-search-trigger',    */    
       /* trigger1Cls: "erase-22",
        trigger2Cls: "filter-blue-22",   */

        constructor:function(config){

            var me=this;

            Ext.applyIf(config,{
                triggers: {
                    clear: {
                    cls:"x-form-clear-trigger",
                      tabIndex :2,
                       hidden:true,
                       handler: function(self,el) {

                            self.collapse();
                            // this.reset();
                            self.setValue("");
                            //this.triggerEl.elements[0].hide();
                            self.focus();

                            el.setHidden(true);
                            self.setValue('');                                  
                       }
                   }
                }
            });

            me.callParent([config]);
            me.on('change',me.onChange);

            me.getStore().on('filterchange',function(store, filters, eOpts){

               if(me.forseSelection){
                   me.valid=(store.getCount()>0);
                   if(!me.valid){
                     me.collapse();
                   }

                   me.fireEvent('filtered',me,me.valid);
                   if(typeof(controller)!='undefined'){
                       if(controller.hasOwnProperty('filtered')){
                            me.on('filtered',controller.filtered);                    
                       }
                   }
               }
            });
        },     
        initComponent:function(){
        	var me=this;
            var controller=me.listeners;
            //delete me.listeners;
            /*me.on('afterrender',function(self){
                if(self.getValue()==null){
                    //self.triggerEl.elements[0].hide();
                }
            }); */                     
            /*me.getStore().on('filterchange',function(store, filters, eOpts){

               if(me.forseSelection){
                   me.valid=(store.getCount()>0);
                   if(!me.valid){
                     me.collapse();
                   }

                   me.fireEvent('filtered',me,me.valid);
                   if(typeof(controller)!='undefined'){
                       if(controller.hasOwnProperty('filtered')){
                            me.on('filtered',controller.filtered);                    
                       }
                   }
               }
            });*/
           
        	Ext.applyIf(me,{
        		name:me.name,
        		fieldLabel:me.fieldLabel,
                displayField:me.displayField,
        		valueField:me.valueField,
        		store:me.store,
                forseSelection:(typeof(me.forseSelection)!='undefined')?me.forseSelection:true,
        		listConfig: {
    	            loadingText: 'Buscando...',
    	            emptyText: 'No se encontrarón coincidencias',
    	            getInnerTpl: function() {				               
                        return '{'+me.displayField+'}';
                    }            
    	        },
                listeners:{
                  render : function(self) {
                    var limpiar=self.triggerEl.elements[0];
                    var filtrar=self.triggerEl.elements[1];
                    if(self.getValue()==null){
                        //limpiar.hide();                        
                    }

                    /*limpiar.tooltip="Limpiar";

                    tooltip=self.fieldLabel;
                    tooltip=(tooltip!="")?tooltip:self.emptyText;
                    tooltip=(tooltip!="")?"Filtrar "+tooltip:"Filtrar";*/
                    // filtrar.tooltip=tooltip;
                    /*Ext.Array.each(self.triggerEl.elements,function(item,index){

                        Ext.tip.QuickTipManager.register({
                            target: item.getAttribute("id"),
                            // title: 'My Tooltip',
                            text: item.tooltip,
                            // width: 100,
                            dismissDelay: 10000 // Hide after 10 seconds hover
                        }); 
                    });*/
                  },
                  blur:function(self){
                   if(!me.valid){
                        me.reset();
                   }else{
                        var record=self.findRecordByDisplay(self.getValue());
                        if(record){
                            self.setValue(record.get(self.valueField));
                            console.log(self.getValue())
                        }
                   }
                  },
                  /*change:function(self){
                    var limpiar=self.triggerEl.elements[0]; 
                    if(self.getValue()!=null){
                        this.autoSelect=true;
                        limpiar.show();
                    }else{
                        this.autoSelect=false;
                        //limpiar.hide();
                    }
                  }*/
                },
                

                // onTrigger1Click: me.onTrigger1Click                 
        	});
            /*Corregir problema de sobrescritura de métodos*/
            if(typeof(controller)!='undefined'){
                Ext.Object.each(controller,function(eName,fn){
                    if(typeof(fn)=='function'){
                        if(me.listeners.hasOwnProperty(eName)){
                            me.on(eName,fn);
                        }else{
                            me.listeners[eName]=fn;  
                        }

                        if(eName=='specialkey'){
                            me.listeners['keyup']=function(self,e){
                                me.fireEvent('keypress',self,e);
                                me.pressed=false;
                            };
                            me.on('keypress',function(self,e){

                                    if (e.getKey() == e.ENTER) { 
                                        //console.log(e.getKey())
                                        if(me.valid){
                                            if(!me.pressed){
                                                me.pressed=true;
                                                me.fireEvent('keyENTER',self,e);                                                
                                            }   
                                        }else{
                                            me.reset();
                                            me.clearValue();
                                            // me.setValue('');
                                        }
                                    }
                            })
                            me.on('keyENTER',fn);
                            delete me.listeners['specialkey'];
                        }
                    } 
                });                   
            };      
	        me.callParent(arguments);            
        },
        onTrigger1Click:function(self){
            this.collapse();
            // this.reset();
            this.setValue("");
            //this.triggerEl.elements[0].hide();
            this.focus();

        },
        onChange:function(){
            var btn_clear=this.getTrigger('clear');
            btn_clear.setHidden(this.getValue()=='');
        }
        
});	