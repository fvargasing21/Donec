/*
	created by: Fabian Vargas F
	date:24/06/2016
	description: Componente personalizado, para realizar filtros.
*/
Ext.define('Admin.utils.com.searchButton', {
	extend: 'Ext.form.field.Text',
	alias: ['widget.searchbutton'],
  cls:'search-field',
	constructor: function(config) {
		var me = this;
		Ext.apply(config, {
      triggers: {
          search: {
            scope:me,
            cls: 'x-form-search-trigger',
            tabIndex :1,
            listeners: {
              // scope:me,
              click:function(self){
                if(config.listeners!=undefined){
                  if(config.listeners.hasOwnProperty("search")){
                    console.log("click")
                    config.listeners.search(self);
                  }
                }else{
                  console.info('Debe definir una funcion en el listener, llamada search, para realizar una acción.');  
                }
              }
            }
          },
          clear: {
            scope:me,
            cls:"x-form-clear-trigger",
            tabIndex :2,
            hidden:true,
            handler:function(self){
              if(config.listeners!=undefined){
                if(config.listeners.hasOwnProperty("clear")){
                  config.listeners.clear(me);
                }else{
                  self.reset(); 
                }
              }else{
                self.reset();
              }
            } 
         }
      }
		});
		
		me.callParent([config]);
		me.on('change',me.onChange);
    me.on("specialkey",function (nf, evt) {
      if(evt.ENTER==evt.getKey()){
        if(config.listeners!=undefined){
          if(config.listeners.hasOwnProperty("search")){config.listeners.search(self);}
        }else{
          console.info('Debe definir una funcion en el listener, llamada search, para realizar una acción.');  
        }
      }
    });
	},
	onChange:function(){
		var btn_clear=this.getTrigger('clear');
		btn_clear.setHidden(this.getValue()=='');
	}
});