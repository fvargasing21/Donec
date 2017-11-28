Ext.define('Admin.model.paciente.Paciente', {
    extend:'Admin.model.Base',
    fields:[
        {   
          name : 'id',
          persist: false
        },
        "nombre",
        "apellido",
        "documento",
        "direccion",
        "localidad",
        "provincia",
        "fecha_nacimiento",
        "sexo",
        "telefono",
        "diagnostico",
        "fecha_ingreso",
        "fecha_alta"
    ],
    proxy: {
       type: 'rest',
       url : Constants.URL_PACIENTE
    }
});