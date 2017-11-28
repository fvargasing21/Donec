Ext.define('Admin.store.NavigationTree', {
    extend: 'Ext.data.TreeStore',

    storeId: 'NavigationTree',

    fields: [{
        name: 'text'
    }],

    root: {
        expanded: true,
        children: [
            {
                text: 'Pacientes',
                iconCls: 'x-fa fa-user-md',
                rowCls: 'nav-tree-badge nav-tree-badge-new',
                viewType: 'paciente',
                routeId: 'paciente', // routeId defaults to viewType
                leaf: true
            }/*,
            {
                text: 'Usuarios',
                iconCls: 'x-fa fa-user',
                viewType: 'users',
                routeId: 'users',
                hidden:true,
                leaf: true
            }*/

            /*,
                {
                text: 'Profile',
                iconCls: 'x-fa fa-user',
                viewType: 'profile',
                leaf: true
            }, 
            {
                text: 'Search results',
                iconCls: 'x-fa fa-search',
                viewType: 'searchresults',
                leaf: true
            },
            {
                text: 'FAQ',
                iconCls: 'x-fa fa-question',
                viewType: 'faq',
                leaf: true
            },
            {
                text: 'Pages',
                iconCls: 'x-fa fa-leanpub',
                expanded: false,
                selectable: false,
                //routeId: 'pages-parent',
                //id: 'pages-parent',

                children: [
                    {
                        text: 'Blank Page',
                        iconCls: 'x-fa fa-file-o',
                        viewType: 'pageblank',
                        leaf: true
                    },

                    {
                        text: '404 Error',
                        iconCls: 'x-fa fa-exclamation-triangle',
                        viewType: 'page404',
                        leaf: true
                    },
                    {
                        text: '500 Error',
                        iconCls: 'x-fa fa-times-circle',
                        viewType: 'page500',
                        leaf: true
                    },
                    {
                        text: 'Lock Screen',
                        iconCls: 'x-fa fa-lock',
                        viewType: 'lockscreen',
                        leaf: true
                    },

                    {
                        text: 'Login',
                        viewType: 'passwordreset',
                        leaf: true
                    }
                ]
            },
            {
                text: 'Widgets',
                iconCls: 'x-fa fa-flask',
                viewType: 'widgets',
                leaf: true
            },
            {
                text: 'Forms',
                iconCls: 'x-fa fa-edit',
                viewType: 'forms',
                leaf: true
            },
            {
                text: 'Charts',
                iconCls: 'x-fa fa-pie-chart',
                viewType: 'charts',
                leaf: true
            }*/
        ]
    },
    listeners:{
        load:function(store, records, successful, operation, node, eOpts ){
            console.log(records);
        } 
    }
});
