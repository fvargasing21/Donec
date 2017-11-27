# Donec API:


Donec API Es la herramienta ideal para agilizar el proceso de Desarrollo de sus proyectos; Permite crear Modelos y Schemas de manera dinámica, despreocúpese de estructurar en carpetas y archivos sus modelos, Donec lo hace por ti, además le proporciona al instante acceso a la arquitectura Rest (Representational State Tranfer) para consumir los servicios de cada Entidad.

Al crear un nuevo Schema, que podríamos denominar “persona”; disponemos de una serie de rutas dinámicas que nos permite acceder a los recursos a través de Http, por medio de los métodos de la arquitectura Rest (**POST,GET,PUT,DELETE**) que nos permite crear,listar,actualizar y eliminar registros de la base de datos, para el modelo personas este seria la URI.
http://localhost:3000/app/personas

 De esta forma disponemos de las operaciones genéricas: CRUD para cada entidad, esto sin duda agiliza el desarrollo de cualquier aplicación y además ofrece escalabilidad por medio de funciones especializadas (Ver Routes).

## Schemas:

Los Schemas representan la estructura de los Modelos, cada modelo instanciado dinámicamente representa una tabla, como se le conoce en bases de datos relacionales, en este contexto utilizaremos el termino de Colecciones (Collections).

Donec proporciona un archivo base para registrar los esquemas de una aplicación, este se encuentra en la ruta:

server/database/config.json

En el arreglo “collections” se disponen por defecto los esquemas del core de la aplicación, como lo son user, group, module, en ella podemos agregar nuestros esquemas personalizados.

Los esquemas tienen la siguiente estructura:
```javascript
{
	name:”NOMBRE_DEL_SCHEMA”,
	config:”{CAMPOS_DEL_SCHEMA_EN_FORMATO_JSON}”,
	lang:”IDIOMA:(es,en)”
}
```
El campo nombre representa el nombre de la colección, config es un parámetro de tipo texto, en él se especifican en formato Json los campos de la colección.
Ver guia mongoose - Schemas 
lang: indica el idioma en que estará escrita la colección, este campo es indispensable para las rutas dinámicas, estas se prularizan de acuerdo al lenguaje estipulado, es decir, si la collección se llama persona, al definir el lenguaje Español, la ruta generada seria /app/personas en plural, si se especifica en ingles, por ejemplo: people su ruta seria /app/peoples.

En Donec, además de un archivo de configuración base, podemos seguir extendiendo la funcionalidad de nuestra aplicación creando directamente Schemas nuevos en la base de datos.
Para ello podemos crearlos con el recurso: http://localhost:3000/schemas 
Pasandole los  parámetros del nuevo Schema por **POST:**
name, config, lang.

Si desea actualizar un Schema, debe especificar el campo: (_id ó id); ambos representan el identificador único del documento en base de datos.

Para eliminar un Schema, debe utilizar el Método **DELETE**, y pasarle el id como parámetro de URL, de la siguiente manera:
http://localhost:3000/schemas/ID_DEL_DOCUMENTO 

Si desea listar los Schemas, utilice el método **GET**, si especifica parámetros de URL como el id o parámetros del body, se filtraran los registros que cumplan con las condiciones especificadas.

De esta manera podemos, crear, actualizar, listar y eliminar Schemas y construir la base de datos de nuestra aplicación.


## Routes:

Las rutas son los recursos o servicios de la aplicación, estas pueden ser públicas o privadas.
## Rutas públicas: 
Son recursos accesibles sin autenticación, como por ejemplo:  http://localhost:3000/schemas/ http://localhost:3000/login/ http://localhost:3000/logout	http://localhost:3000/install	

## Rutas privadas: 
Son aquellas que hacen parte de la aplicación, por ello se encuentran en la ruta /app/RUTA_PRIVADA
Por ejemplo: una ruta privada seria la referente a una colección o servicio que hace parte de la lógica de negocio de nuestra aplicación, que podría ser “pagos”. Esta ruta estaría accesible solo si el usuario está autenticado. /app/pagos

## Rutas Dínamicas:

Las rutas dinámicas se generan automáticamente al crear un nuevo Schema, estas son accesibles dentro de la aplicación, por ejemplo: /app/medicos

Podemos seguir extendiendo la funcionalidad de nuestra aplicación creando nuestra propias rutas personalizadas.

## Rutas Personalizadas:

Estas se deben colocar dentro del directorio server/routes en este directorio, puede crear sus rutas públicas personalizadas,  creando un archivo js por ejemplo: MedicoRoute.js
la estructura de un router publico seria:







```javascript
module.exports = function(app,io,db){
	//Constructor del router
	db.on("medico",function(schema){
		//Evento se dispara cuando se crea el modelo medico
	});
	app.post("/medico",function(req,res){
		//Funcionalidad del recurso por POST
	});
	app.get("/medico",function(req,res){
		//Funcionalidad del recurso por GET
	});
}
```
Un router puede contener una serie de rutas personalizadas (servicios), que pueden ser accedidas por los diferentes métodos de la API Rest, y realizar procedimientos específicos con la base de datos o llamar servicios que realicen alguna operación especifica y retornar una respuesta al cliente.

Ejemplo: Filtrar los médicos y retornar la respuesta en Json:
	
```javascript
	
	app.get("/medico",function(req,res){
		var params = req.query;
		db.medico.find(params,function(err,docs){
			res.send(JSON.stringify({data:docs}));
		});
	});

```


## Sobre escritura de Rutas Dinámicas: 

Donec, permite reescribir las rutas dinámicas de las entidades de la aplicación, estas se encuentran el  el directorio /server/routes/app/

En esta carpeta puede crear routes que tengan que ver con una entidad de la base de datos, por ejemplo si se desea reescribir la funcionalidad de la entidad user, se debe crear un archivo con el nombre de la entidad en sigular: User.js

La estructura de una ruta privada seria de la siguiente forma:

```javascript
module.exports = function(app,io,router,db,schema){
	//Constructor del router
	
	schema.virtual("fullname").get(function(){
		return this.name+" "+this.lastname;
	});

	schema.statics.listar = function(params,callback){
		var result=[];
		db.user.query(params,function(err,query){
			
			var cursor = query.populate('usergroup')
			.select('username email usergroup modules')
			.cursor()
			.eachAsync(function(user) {
				result.push(user);
		        user.usergroup.modules.forEach(function(docs,index,arr){
		        	db.module.findOne(docs.module,(err,doc)=>{
		        		user.usergroup.modules[index]=doc;
		        	});
		        });
	      	})
	    	.then(res => {
	    		callback(result);
	    	});				
		});
	}
	
	//Roter para listar usuarios
	router.route("/users").get(function(req,res){
		//método personalizado creado en el constructor del router.
		db.user.listar(req.query,function(docs){
			res.send(JSON.stringify({data:docs,success:true}));
		});
	});
	return router;
}
```

En el ejemplo anterior se sobre escribe el recurso /app/users accesible por el método GET; En las rutas privadas no es necesario especificar el path /app/ simplemente el nombre de la entidad, en este caso /users como se muestra en el ejemplo.
Esta ruta remplazará la ruta creada dinámicamente para el recurso /users por medio del método GET.

En este ejemplo se extiende la funcionalidad del modelo user, creando un método nuevo denominado listar, que internamente realiza una consulta en la base de datos, haciendo “join” con usergroup, y recorriendo los módulos del grupo para insertarlos en la colección de modulos, con la ayuda de un cursor.

Luego esta función es utilizada en el router por medio del metodo GET
```javascript
	router.route("/users").get(function(req,res){
		//método personalizado creado en el constructor del router.
		db.user.listar(req.query,function(docs){
			res.send(JSON.stringify({data:docs,success:true}));
		});
	});
```
En las rutas dinámicas se cuenta con los objetos:  app,io,router,db,schema
**app:** permite acceder a funciones especificas de la aplicación,
**router:** Determina el middleware para generar nuevas rutas para la aplicación.
**Io:** Permite utilizar el servidor Socket, emitir y escuchar eventos.
**db:** Contiene el objeto ManagerDB que dispone de todos los modelos de la base de datos, estos son accesibles como propiedades de este, por ejemplo: db.user; cada modelo hereda las funcionalidades esenciales de un Modelo Mongoose, es decir, que podemos acceder a las funciones que dispone la API de Mongoose a través de este objeto. (Ver Documentación de Mongoose)
**schema:**
Brinda el Schema de la entidad, con el cuale se puede seguir extendiendo la funcionalidad de la entidad, creando virtuals o funciones estáticas, que luego pueden ser usadas por el modelo. 

De esta forma se puede explorar el potencial de Donec y escalar la funcionalidad de la aplicación creando procedimiento especializados que se ajusten a los requerimientos de nuestro proyecto.