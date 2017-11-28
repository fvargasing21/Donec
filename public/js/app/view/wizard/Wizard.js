Ext.define('Admin.view.wizard.Wizard', {
    extend: 'Ext.panel.Panel',
    xtype: 'wizard-panel',

    requires: [
        'Admin.view.wizard.WizardFormModel',
        'Admin.view.wizard.WizardFormController'
    ],
    layout: 'card',

    viewModel: {
        type: 'wizardformModel'
    },

    controller:'wizardform_c',
    cls: 'wizardone',
    colorScheme: 'blue',
    flex: 1,
    defaults : {
        /*
         * Seek out the first enabled, focusable, empty textfield when the form is focused
         */
        //defaultFocus: 'textfield:not([value]):focusable:not([disabled])',

        defaultButton : 'nextbutton'
    },

    items: [
        {
            xtype: 'form',
            items:[
                {
                    html : '<h2>Bienvenido...</h2><p>Por favor diligencie los siguientes datos para hacer uso de este software.</p>'
                }
            ]
        },
        {
            xtype: 'form',
            defaultType: 'textfield',
            defaults: {
                labelWidth: 90,
                labelAlign: 'top',
                labelSeparator: '',
                submitEmptyText: false,
                anchor: '100%'
            },
            items:[
                {
                    emptyText : 'Usuario.',
                    name:'username',
                    allowBlank:false
                },
                {
                    emptyText : 'email: me@donec.co',
                    name:'email',
                    vtype: 'email',
                    allowBlank:false
                },
                {
                    emptyText : 'Contraseña',
                    name: 'password',
                    inputType: 'password',
                    cls: 'wizard-form-break',
                    allowBlank:false
                },
                {
                    emptyText : 'Repetir Contraseña',
                    inputType: 'password',
                    name: 're_password',
                    allowBlank:false
                }
            ]
        },
        {
            xtype: 'form',
            items:[
                {
                    html : '<h2>Antes de finalizar la Instalación.</h2><p>Verifique los datos ingresados.</p>'
                }
            ]
        }
    ],

    initComponent: function() {

        this.tbar = {
            reference: 'progress',
            defaultButtonUI: 'wizard-' + this.colorScheme,
            cls: 'wizardprogressbar',
            defaults: {
                disabled: true,
                iconAlign:'top'
            },
            layout: {
                pack: 'center'
            },
            items: [
                {
                    step: 0,
                    iconCls: 'fa fa-info',
                    pressed: true,
                    enableToggle: true,
                    text: 'Bienvenido'
                },
                {
                    step: 1,
                    iconCls: 'fa fa-user',
                    enableToggle: true,
                    text: 'Usuario'
                },
                {
                    step: 2,
                    iconCls: 'fa fa-upload',
                    enableToggle: true,
                    text: 'Finalizar'
                }
            ]
        };

        this.bbar = {
            reference: 'navigation-toolbar',
            margin: 8,
            items: [
                '->',
                {
                    text: 'Volver',
                    ui: this.colorScheme,
                    id:'vol_btn',
                    bind: {
                        disabled: '{atBeginning}'
                    },
                    listeners: {
                        click: 'onPreviousClick'
                    }
                },
                {
                    text: 'Siguiente',
                    ui: this.colorScheme,
                    id:'sig_btn',
                    reference : 'nextbutton',
                    bind: {
                        disabled: '{atEnd}'
                    },
                    listeners: {
                        click: 'onNextClick'
                    }
                },
                {
                    text: 'Finalizar',
                    ui: this.colorScheme,
                    id:'finishButton',
                    hidden: true,
                    formBind: true,
                    reference : 'finishbutton',
                    listeners: {
                        click: 'onFinishClick'
                    }
                }
            ]
        };

        this.callParent();
    }
});