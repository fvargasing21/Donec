Ext.define('Admin.utils.com.fileUpload', {
	extend: 'Ext.form.field.File',
	alias: ['widget.fileupload'],
	multiple:true,
	initComponent: function() {
		var me = this;

		Ext.apply(me, {
			listeners:{
				afterrender:function(self){
					if(me.multiple){
						self.fileInputEl.set({
							multiple:'multiple',
							name:me.name?me.name+'[]':'files[]'
						});
					}
				}
			}		
		});

		me.callParent(arguments);
	}
});