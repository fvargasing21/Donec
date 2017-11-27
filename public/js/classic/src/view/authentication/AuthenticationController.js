Ext.define('Admin.view.authentication.AuthenticationController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.authentication',

    //TODO: implement central Facebook OATH handling here

    onFaceBookLogin : function() {
        this.redirectTo('dashboard', true);
    },

    onLoginButton: function(self) {
        var me = this;
        var form = self.up('form');
        if (form.isValid()) {
            form.submit({
                method:"GET",
                url:Constants.URL_LOGIN,
                waitMsg: 'Procesando solicitud...',
                success: function(f, action) {
                    var res = action.result;
                    localStorage.user =JSON.stringify(res.user);
                    localStorage.user_id =res.user._id;
                    localStorage.username =res.user.username;
                    //location.reload();
                    me.redirectTo('paciente', true);
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
        
    },

    onLoginAsButton: function() {
        this.redirectTo('login', true);
    },

    onNewAccount:  function() {
        this.redirectTo('register', true);
    },

    onSignupClick:  function() {
        this.redirectTo('dashboard', true);
    },

    onResetClick:  function() {
        this.redirectTo(((!localStorage.user_id)?'login':'ptz'), true);
    }
});