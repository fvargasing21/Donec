Ext.define('Admin.view.pages.OfflinePage', {
    extend: 'Admin.view.pages.ErrorBase',
    xtype: 'offline',

    requires: [
        'Ext.container.Container',
        'Ext.form.Label',
        'Ext.layout.container.VBox',
        'Ext.toolbar.Spacer'
    ],

    items: [
        {
            xtype: 'container',
            width: 600,
            cls:'error-page-inner-container',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            items: [
                {
                    xtype: 'label',
                    cls: 'error-page-top-text',
                    text: '500'
                },
                {
                    xtype: 'label',
                    cls: 'error-page-desc',
                    html: '<div>Verifique su conexión a internet.</div>' +
                          '<div>Reintente instalar la aplicación <a href="#wizard"> Instalar </a></div>'
                },
                {
                    xtype: 'tbspacer',
                    flex: 1
                }
            ]
        }
    ]
});
