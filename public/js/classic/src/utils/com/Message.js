Ext.define("Admin.utils.com.Menssage",{
	extend : "Ext.window.MessageBox",
	alternateClassName: "Msg",
	singleton: true,
	
	alert	: function(message,funcion){
		this.show({
			title	: "Alert",
			modal	: true,
			icon	: Ext.Msg.WARNING,
			buttons	: Ext.Msg.OK,
			msg		: message,
			fn		: funcion || Ext.emptyFn
		});
	},
	
	info: function(message){
		Ext.ventana.msg('Información',message);
	},
	
	informacion	: function(message,funcion){
		this.show({
			title	: "Información",
			modal	: true,
			icon	: Ext.Msg.INFO,
			buttons	: Ext.Msg.OK,
			msg		: message,
			fn		: funcion || Ext.emptyFn
		});
	},

	error	: function(message,funcion){
		this.show({
			title	: "Error",
			modal	: true,
			icon	: Ext.Msg.ERROR,
			buttons	: Ext.Msg.OK,
			msg		: message,
			fn		: funcion || Ext.emptyFn
		});
	},
	
	warning	: function(title,message,funcion){
		this.show({
			title	: title,
			modal	: true,
			icon	: Ext.Msg.WARNING,
			buttons	: Ext.Msg.OK,
			msg		: message,
			fn		:funcion || Ext.emptyFn
		});
	},
	
	confirm	: function(message,callback,scope){
		this.show({
			title	: "Confirmaci&oacute;n",
			modal	: true,
			closable:false,
			icon	: Ext.Msg.QUESTION,
			buttons	: Ext.Msg.YESNO,
			msg		: message,
			fn		: callback || Ext.emptyFn,
			scope	: scope || this
		});
	},
	
	errorServer : function (e) {
		var msg = '<h1>Respuesta incorrecta del servidor</h1><br>'+e.message;
		Ext.create('Ext.window.Window',{
			height: 500,
			width: 600,
			autoScroll: true,
			title: 'Advertencia',
			modal: true,
			autoShow: true,
			html : msg
		});
	},
	
	errorFailureServer : function (response, opts) {
		var msg = 'A ocurrido un error (note: response not is object)';
		var title = '';
		if(Ext.isObject(response)){
			msg = '<h1>'+response.statusText+'</h1>'+response.responseText;
			title = response.status;
		}
		Ext.create('Ext.window.Window',{
			height: 500,
			width: 600,
			autoScroll: true,
			title: 'Error '+title,
			modal: true,
			autoShow: true,
			html : msg
		});
	}

	
	
	
});
