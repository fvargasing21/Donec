Ext.define('Admin.view.paciente.pacientesGrid', {
	extend: 'Ext.grid.Panel',
	alias: ['widget.pacientes'],
	// title:'Listado de Historias Clinicas',
    bind:{
        store:'{pacienteStore}'
    },
    region:'center',
    cls: 'user-grid',
    forceFit:true,
    layout:'fit',
    plugins:[
       Ext.create('Ext.grid.plugin.CellEditing',{
          clicksToEdit: 2
       })
    ],
    /*listeners:{
        select :function( self, record, index, eOpts){
            console.log(record);  
        } 
    },*/
    columns:
    {   
        /*defaults:{
            editor: Ext.create('Ext.form.field.Text',{
                selectOnFocus: true,
                listeners: {
                    specialkey:'onSaveEnter'
                }
            })
        },*/
        items:
            [
            {
                dataIndex: "nombre",
                text:"Nombre",
            },
            {
                dataIndex: "apellido",
                text:       "Apellido",
            },
            {
                dataIndex: "documento",
                text:       "Documento",
            },
            {
                dataIndex: "direccion",
                text:       "Direccion",
            },
            {
                dataIndex: "localidad",
                text:       "Localidad",
            },
            {
                dataIndex: "provincia",
                text:       "Provincia",
            },
            {
                dataIndex: "fecha_nacimiento",
                text:       "Fecha nacimiento",
            },
            {
                dataIndex: "sexo",
                text:       "Sexo",
            },
            {
                dataIndex: "telefono",
                text:       "Telefono",
            },
            {
                dataIndex: "diagnostico",
                text:       "Diagnostico",
            },
            {
                dataIndex: "fecha_ingreso",
                text:       "Fecha ingreso",
            },
            {
                dataIndex: "fecha_alta",
                text:       "Fecha_alta"
            },
            {
                xtype: 'actioncolumn',
                cls: 'content-column',
                cls: 'content-column',
                text: 'Acciones',
                items: [
                    {
                        xtype: 'button',
                        iconCls: 'fa fa-upload',
                        tooltip: 'Subir Diagnóstico',
                        handler:'upload',                       
                    }
                ]
            }
        ]
    },
    dockedItems:[
         {
             xtype:"toolbar",
             dock:'top',
             items:[
                {
                    xtype: 'textfield',
                    name: 'nombre',
                    emptyText: 'Nombre'
                },
                {
                    xtype: 'textfield',
                    name:"documento",
                    emptyText:"Documento"
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
                   name: 'nuevo',
                   // handler:'nuevo'
                }
             ]
         }
    ],
     listeners:{
	        select:'onSelect',
        cellkeydown:function( self, td, cellIndex, record, tr, rowIndex, e, eOpts ){
            var grid = self.up("grid");
            record.set("changed",(!record.get("changed")));
            console.log(record.get("changed"));
        }
     }             
		
});