Ext.define('Admin.socket.Socket', {
	alternateClassName: 'Socket',
	init: function() {
		
		//Ext.apply(this,socket);
	},
	connect:function(callback){
		var socket = io.connect(BASE_PATH,{'forceNew':true});
		socket.on("start",function(config){
		    global.socket=socket;
		    if(callback!=undefined){
		    	callback(config);
		    }
		});
	}
});