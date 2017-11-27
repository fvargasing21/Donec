
Ext.define('Admin.view.home.Home',{
    extend: 'Ext.panel.Panel',
    xtype:'home',
    requires: [
        'Admin.view.home.HomeController',
        'Admin.view.home.HomeModel'
    ],

    controller: 'home-home',
    viewModel: {
        type: 'home-home'
    },
    flex:1,
    margin:20,
    cls: 'shadow',
    html: 'Hello, World!!'
});
