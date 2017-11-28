
Ext.define('Admin.view.paciente.Paciente',{
    extend: 'Ext.panel.Panel',
    xtype:'paciente',
    requires: [
        'Admin.view.paciente.PacienteController',
        'Admin.view.paciente.PacienteModel',
        'Admin.view.paciente.pacienteForm',
        'Admin.view.paciente.pacientesGrid'
        
    ],
    controller: 'paciente-paciente',
    viewModel: {
        type: 'paciente-paciente'
    },
    layout:{
        type:'vbox',
        align:'stretch'
    },
    flex:1,
    // height:600,
    iconCls: 'x-fa fa-user-md',
    title:'Historias Clínicas',
    margin:20,
    cls: 'shadow',
    items:[
        {
            xtype:'pacienteform',
            flex:.6
        },
        {
            xtype:'pacientes',
            flex:.4
        }
     ] 
});
