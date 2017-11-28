Ext.define('Admin.model.user.User', {
    extend: 'Admin.model.Base',
    fields:[
        'username',
        'email',
        'cedula',
        'telefono',
        'celular',
        'direccion',
        'nombres',
        'apellidos',
        {name:'id'},
        { name: 'rol', mapping:'usergroup.name'},
        { name: 'usergroup', mapping:'usergroup._id', reference: 'Admin.model.group.Group'},
        'estado'
    ]
});