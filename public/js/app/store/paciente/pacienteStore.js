Ext.define('Admin.store.paciente.pacienteStore', {
    extend: 'Ext.data.Store',
    alias: 'store.pacientestore',
    storeId: 'pacienteStore',
	model: 'Admin.model.paciente.Paciente',
	autoLoad: true,
	pageSize: 20,
	proxy: {
		type: 'ajax',
		url: Constants.URL_PACIENTE,
		reader: {
			type:'json',
			rootProperty:'data',
		},
		actionMethods:{
			read:'GET'
		},
		extraParams: {
		    estado:0
		}
	},
	listeners: {
		// load: 'onLoadistadopacienterechazadasstore'
	}
});