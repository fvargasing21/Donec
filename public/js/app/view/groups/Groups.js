
Ext.define('Admin.view.groups.Groups',{
    extend: 'Ext.panel.Panel',

    requires: [
        'Admin.view.groups.GroupsController',
        'Admin.view.groups.GroupsModel'
    ],

    controller: 'groups-groups',
    viewModel: {
        type: 'groups-groups'
    },

    html: 'Hello, World!!'
});
