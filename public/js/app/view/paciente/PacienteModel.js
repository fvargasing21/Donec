Ext.define('Admin.view.paciente.PacienteModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.paciente-paciente',
    data: {
        name: 'Admin',
        paciente:{}
    },
    stores:{
		pacienteStore: Ext.create('Admin.store.paciente.pacienteStore')
    }

});
