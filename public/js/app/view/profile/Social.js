Ext.define('Admin.view.profile.Social', {
    extend: 'Ext.panel.Panel',
    xtype: 'profilesocial',

    requires: [
        'Ext.Button',
        'Ext.Container'
    ],

    layout: {
        type: 'vbox',
        align: 'middle'
    },
    /*viewModel: {
        type:'main'
    },*/
    // height: 320,
    
    bodyPadding: 5,
    cls:'userProfile-container',
    items: [
        {
            xtype: 'image',
            cls: 'userProfilePic',
            height: 120,
            width: 120,
            alt: 'profile-picture',
            // cls: 'header-right-profile-image',
            bind:{
                src: '{picture}',
            },
            // src: 'resources/images/user-profile/2.png'
        },
        {
            xtype: 'component',
            cls: 'userProfileName',
            height: '',
            bind:{
                html: '{nombre}'
            }
        },
        {
            xtype: 'component',
            cls: 'userProfileDesc',
            bind:{
                html: '{rol}'
            }
        },
       /* {
            xtype: 'container',
            layout: 'hbox',
            defaults: {
                xtype: 'button',
                margin: 5
            },
            margin: 5,
            items: [
                {
                    ui: 'facebook',
                    iconCls: 'x-fa fa-facebook'
                },
                {
                    ui: 'soft-cyan',
                    iconCls: 'x-fa fa-twitter'
                },
                {
                    ui: 'soft-red',
                    iconCls: 'x-fa fa-google-plus'
                },
                {
                    ui: 'soft-purple',
                    iconCls: 'x-fa fa-envelope'
                }
            ]
        },*/
        {
            xtype: 'button',
            width: 120,
            text: 'Ver perfil',
            ui:'soft-cyan',
            platformConfig: {
                classic: {
                    scale: 'small'
                },
                modern: {
                    ui: 'soft-cyan'
                }
            },
            handler:'onViewPerfil'
        }
    ]
});