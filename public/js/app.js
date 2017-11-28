/*
 * This file is responsible for launching the application. Application logic should be
 * placed in the Admin.Application class.
 */
Ext.application({
    name: 'Admin',

    extend: 'Admin.Application',

    // Simply require all classes in the application. This is sufficient to ensure
    // that all Admin classes will be included in the application build. If classes
    // have specific requirements on each other, you may need to still require them
    // explicitly.
    //
    requires: [
        'Admin.*'
    ],
    launch:function(){
        /*   var self =this;
        var socket =  new Admin.socket.Socket();
        socket.connect(function(options){
            console.log(options);
            var config = options.config;

            var camera = config.camera;
            var instaled = options.success;
            
            localStorage.instaled = instaled;
            localStorage.config = JSON.stringify(config);

            global.IP_CAMERA = camera.camera_ip+"/mjpg/video.mjpg";
            console.log(localStorage.instaled,global.IP_CAMERA);
        });*/  
    },
    loadConfig:function(callback){
        /*Ext.Ajax.request({
            scope: this,
            url: Constants.URL_CONFIG_APP,
            params: {
                
            },
            success: function(response) {
                var responseObject = Ext.decode(response.responseText);
                console.log(responseObject);
                if(callback!=undefined){
                    callback(responseObject);
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
        });*/
    }

});
