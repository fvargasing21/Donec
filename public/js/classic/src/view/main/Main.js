Ext.define('Admin.view.main.Main', {
    extend: 'Ext.container.Viewport',

    requires: [
        'Ext.button.Segmented',
        'Admin.view.preferences.Preferences',
        'Ext.list.Tree'
    ],

    controller: 'main',
    viewModel: 'main',

    cls: 'sencha-dash-viewport',
    itemId: 'mainView',

    layout: {
        type: 'vbox',
        align: 'stretch'
    },

    listeners: {
        render: 'onMainViewRender',
        beforerender:'onMainViewBeforeRender'
    },
    items: [
         {
             xtype: 'toolbar',
             cls: 'sencha-dash-dash-headerbar shadow',
             height: 64,
             itemId: 'headerBar',
             items: [
                 {
                     xtype: 'component',
                     reference: 'senchaLogo',
                     cls: 'sencha-logo',
                     html: '<div class="main-logo"><img src="resources/images/company-logo.png">Donec</div>',
                     width: 250
                 },
                 {
                     margin: '0 0 0 8',
                     ui: 'header',
                     iconCls:'x-fa fa-navicon',
                     id: 'main-navigation-btn',
                     handler: 'onToggleNavigationSize'
                 },
                 '->',
                 {
                    xtype: 'button',
                    enableToggle: true,
                    iconCls:'x-fa fa-refresh',
                    listeners:{
                        toggle:'onToggleSync'
                    },
                    // ui: 'header',
                    // href: '#profile',
                    // hrefTarget: '_self',
                    tooltip: 'Sincronización Automática'
                 },
                 /*{
                     xtype: 'segmentedbutton',
                     margin: '0 16 0 0',

                     platformConfig: {
                         ie9m: {
                             hidden: true
                         }
                     },

                     items: [{
                         iconCls: 'x-fa fa-desktop',
                         pressed: true
                     }, {
                         iconCls: 'x-fa fa-tablet',
                         handler: 'onSwitchToModern',
                         tooltip: 'Switch to modern toolkit'
                     }]
                 },
                 {
                     iconCls:'x-fa fa-search',
                     ui: 'header',
                     href: '#searchresults',
                     hrefTarget: '_self',
                     tooltip: 'See latest search'
                 },
                 {
                     iconCls:'x-fa fa-envelope',
                     ui: 'header',
                     href: '#email',
                     hrefTarget: '_self',
                     tooltip: 'Check your email'
                 },
                 {
                     iconCls:'x-fa fa-question',
                     ui: 'header',
                     href: '#faq',
                     hrefTarget: '_self',
                     tooltip: 'Help / FAQ\'s'
                 },
                 {
                     iconCls:'x-fa fa-th-large',
                     ui: 'header',
                     href: '#profile',
                     hrefTarget: '_self',
                     tooltip: 'See your profile'
                 },*/
                 /*{
                     xtype: 'tbtext',
                     bind:{
                         text: '{username}',
                     },
                     cls: 'top-user-name'
                 },
                 {
                     xtype: 'image',
                     cls: 'header-right-profile-image',
                     height: 35,
                     width: 35,
                     alt:'current user image',
                     bind:{
                         src:'{picture}'
                     },
                     listeners: {
                         scope:this,
                         el: {
                             click:'onClickUser'
                         }
                     }
                 }*/
             ]
         },
         {
             xtype: 'maincontainerwrap',
             id: 'main-view-detail-wrap',
             reference: 'mainContainerWrap',
             flex: 1,
             items: [
                 {
                     xtype: 'treelist',
                     reference: 'navigationTreeList',
                     itemId: 'navigationTreeList',
                     ui: 'navigation',
                     store: 'NavigationTree',
                     width: 250,
                     expanderFirst: false,
                     expanderOnly: false,
                     listeners: {
                         selectionchange: 'onNavigationTreeSelectionChange'
                     }
                 },
                 {
                     xtype: 'container',
                     flex: 1,
                     reference: 'mainCardPanel',
                     cls: 'sencha-dash-right-main-container',
                     itemId: 'contentPanel',
                     layout: {
                         type: 'card',
                         anchor: '100%'
                     }
                 }
             ]
         }
     ]
});