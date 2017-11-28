
Ext.define('Admin.view.users.Users',{
    extend: 'Ext.panel.Panel',
    xtype: 'users',
    requires: [
        'Admin.view.users.UsersController',
        'Admin.view.users.UsersModel',
        'Admin.view.groups.GroupsModel',
        'Admin.view.users.UserForm'
    ],

    controller: 'users-users',
    viewModel: {
        type: 'users-users'
    },
    layout:{
        type:'fit',
        align:'strech'
    },
    flex:1,
    margin:20,
    cls: 'shadow',
    initComponent: function() {
        var me = this;

        Ext.applyIf(me, {
          items:[
              {
                  xtype:'grilla',
                  bind:{
                      store:'{userstore}'
                  },
                  cls: 'user-grid',
                  forceFit:true,
                  layout:'fit',
                  columns:[
                      {
                          text:"Usuario",
                          dataIndex:'username'
                      },
                      {
                          text:"Email",
                          dataIndex:'email'
                      },
                      {
                          text:"Rol",
                          dataIndex:'rol'
                      },
                      {
                          xtype: 'actioncolumn',
                          cls: 'content-column',
                          width: 450,
                          items: [
                              {
                                  xtype: 'button',
                                  iconCls: 'x-fa fa-pencil',
                                  tooltip: 'Editar Registro',
                                  handler:'onEditar',                       
                                  handler:'onEdit'
                              },
                              {
                                  xtype: 'button',
                                  iconCls: 'x-fa fa-close',
                                  tooltip: 'Eliminar Registro',
                                  handler:'onRemove'
                              }
                          ],
                          cls: 'content-column',
                          // dataIndex: 'bool',
                          text: 'Acciones'                   
                      }
                  ],
                  dockedItems:[
                      {
                          xtype:"toolbar",
                          items:[

                                {
                                    xtype: 'textfield',
                                    name: 'username',
                                    emptyText: 'Usuario'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Filtrar',
                                    name: 'filtrar',
                                    handler:'search'
                                },
                                {
                                    xtype: 'button',
                                    text: 'Limpiar',
                                    name: 'limpiar',
                                    handler:'limpiar'
                                },
                                '->',
                                {
                                    xtype: 'button',
                                    text: 'Nuevo',
                                    name: 'usernew',
                                    // scope:me,
                                    handler:'onNew'
                                }
                          ]
                      }
                  ]
              }
          ]  
        });

        me.callParent(arguments);
    }
});
