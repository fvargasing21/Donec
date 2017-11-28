Ext.define('Admin.utils.com.Grilla',{
    alternateClassName : 'TecnoTasks.Grilla',
    alias : 'widget.grilla',    
    extend : 'Ext.grid.Panel',
   
    // requires : ['Ext.util.Bindable'],
    filtrar:false,
    paginar:true,
    enableColumnHide: false,
    sortableColumns:false,
    // ui:'tecnotaskgrid',
    columns:null,
    refresh:true,
    store:null,
    cls: 'user-grid',
    viewConfig: {
        selectedItemCls: 'grid-row-selected',
        disableSelection: true,
        // stripeRows: false
    },
    reserveScrollbar: true,
    enableColumnMove: false,    
    enableColumnMove: false,
    columnLines: true,  
    enableTextSelection:true,
    constructor:function(config){
        var me=this;
        me.PagingToolbar=new Ext.PagingToolbar({
            name: 'paginador',
            displayInfo : true,
            bind:{
                store:(typeof(config.bind)!='undefined')?config.bind.store:''
            },
            store:me.getStore(),
            displayMsg : (me.paginar)?'{0} - {1} de {2} ':'Total '+ ((typeof(me.title)=="undefined" && !me.paginar)?' Registros':me.title)+' {2} ' + (typeof(me.title)=='undefined'?' ':me.title),
            emptyMsg : 'No hay ' + ((typeof(me.title)=='undefined' || me.title==null)?' registros ':me.title)+ ' para mostrar.',
            pageSize : me.pageSize,
            prevText : "Página anterior",
            nextText : "Página siguiente",
            firstText : "Primera página",
            lastText : "Última página",
            beforePageText : "Página",
            afterPageText : 'de {0}',
            listeners : {
                afterrender : function(component, eOpts) {
                    if(!me.autoLoad){                            
                        component.down('#refresh').setDisabled(true);
                        var btnact = component.items.get(10);
                        if (!me.paginar) {
                            
                            for (var i = 0; i < component.items.length - 2; i++) {
                                component.items.get(i).hide();
                            }
                            btnact.show();
                            btnact.setText('Actualizar');
                        }
                        if(!me.refresh){
                            component.down('#refresh').hide();
                        }else{
                            btnact.show();
                        }
                    }
                    btnact.setDisabled((me.getStore().getCount()==0));
                    me.getStore().on('refresh',function(store,e){
                        btnact.setDisabled((me.getStore().getCount()==0));
                    });
                    
                    me.getStore().on('clear',function(store,e){
                        if(me.filtrar){
                            var toolbar=me.down('toolbar[dock="top"]');
                            Ext.Array.each(toolbar.query('field'),function(item,index){
                                if(!item.readOnly){
                                    item.reset();                                   
                                }
                                store.getProxy().extraParams[item.name]=item.getSubmitValue();
                            });
                            store.loadPage(1);
                            btnact.setDisabled(true);
                        }
                    });
                }
            },
            items: me.items                
        });

        Ext.apply(me,{
            bbar:me.PagingToolbar
        });

        me.callParent([config]);
    },
    initComponent : function() {

        var me = this;
        if(typeof(me.columns)=='object'){
            me.columns['defaults']= {
                menuDisabled: true,
                sortable: false,                    
                height: 40,
                /*focusCls: 'tecnotasks-gridcell-focus',
                baseCls: 'tecnotasks-gridcolumn',
                tdCls: 'tecnotasks-gridcell'  */              
            };   
        }

        Ext.apply(me, {
          forceFit: (me.forceFit!=undefined)?me.forceFit:true,  
          emptyText:'No hay ' + ((typeof(me.title)=='undefined' || me.title==null)?' registros ':me.title)+ ' para mostrar.',  
          paginar:(me.paginar==undefined)?true:me.paginar,
          groupHeaderTpl: '{name} ({rows.length} Item{[values.rows.length > 1 ? "s" : ""]})'
        });
        var mostrar_paginador=true;
        if(!me.pagina && !me.refresh){
            mostrar_paginador=false;
        }
        me.callParent(arguments);
    }
});

