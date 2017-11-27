Ext.define('Admin.utils.data.Store', {
	extend: 'Ext.data.Store',
	alias:'uxstore',
	xtype:'uxstore',
	constructor:function(config){
	  var me = this;
	  // alert(config.url)
	  if(typeof(config.url)!='undefined'){
		  Ext.apply(config, {
		         pageSize:(typeof(config.pageSize)!="undefined")?config.pageSize:5,
		         model:(typeof(config.model)!="undefined")?config.model:null,
		         proxy: {
		             extraParams:config.params,
		             actionMethods:{
		                read:(typeof(config.method!="undefined"))?config.method:"POST"
		             },
		             type: 'ajax',
		             url: config.url,
		             reader: {
		               type: 'json',
		               rootProperty: (typeof(config.rootProperty)!="undefined")?config.rootProperty:'data', 
		               idProperty:(typeof(config.idProperty)!="undefined")?config.idProperty:'id'
		             }
		         }	         
		  });
	  }
	  me.callParent([config]);
	 }  
});