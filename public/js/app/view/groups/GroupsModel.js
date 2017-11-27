Ext.define('Admin.view.groups.GroupsModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.groups-groups',
    requires:[

    ],
    data: {
        name: 'Admin'
    },
    stores:{
    	groupstore: {
    		model: 'Admin.model.group.Group',
    		storeId: 'groupsStore',
    		autoLoad: true,
    		pageSize: 20,
    		proxy: {
    			type: 'ajax',
    			url: Constants.URL_GROUPS,
    			reader: {
    				type:'json',
    				rootProperty:'data',
    			},
    			actionMethods:{
    				read:'GET'
    			}
    		},
    		listeners: {
    			// load: 'onLoadistadoinfraccionrechazadasstore'
    		}
    	}
    }

});
