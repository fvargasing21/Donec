Ext.define('Admin.view.authentication.Wizard', {
    extend: 'Admin.view.authentication.LockingWindow',
    xtype: 'wizard',

    requires: [
        'Admin.view.authentication.Dialog',
        'Admin.view.wizard.Wizard',
        'Ext.form.Label',
        'Ext.form.field.Text',
        'Ext.button.Button'
    ],

    title: 'Instalación',

    defaultFocus : 'authdialog',  // Focus the Auth Form to force field focus as well

    items: [
        {
            xtype: 'authdialog',
            width: 455,
            defaultButton: 'resetPassword',
            autoComplete: true,
            bodyPadding: '20 20',
            layout: {
                type: 'vbox',
                align: 'stretch'
            },

            defaults : {
                margin: '10 0'
            },

            cls: 'auth-dialog-login',
            items: [
                {
                    xtype:'wizard-panel',
                    flex:1
                }
            ]
        }
    ]
});