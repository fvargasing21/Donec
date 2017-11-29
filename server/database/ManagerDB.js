/**
* @author: Fabian Vargas Fontalvo
* email: f_varga@hotmail.com
*/
var events = require('events');//Events administra eventos
var session = require("express-session");
const mongoose = require("mongoose");
var md5 = require('md5');
mongoose.Promise = global.Promise;
var dateFormat = require('dateformat');
var moment = require('moment-timezone');
moment().tz("America/Bogota").format();
var ObjectId = mongoose.Types.ObjectId;

var fs = require("fs");
var path = require("path");

// var Schema = mongoose.Schema;
var config = require("./config.json");
var str2json = require("../helpers/str2json");
var Helper = require("../helpers/helper");

var jsonfile = require("jsonfile");
exports.createManagerDB = function(options,callback) {
  return new ManagerDB(options,callback);
};

/*
* @ManagerDB: options
* Tiene la responsabilidad de
* Conectarse con la base de datos,
* Registra los Esquemas en la Collection schemas
* Cargar y crear instancias de Modelo con los esquemas registrados en schemas
* Administra los Eventos y funciones básicas de un Modelo.
*/
function ManagerDB(options){

	var self = this;
	this.url = path.join(global.APP_PATH,'server','database','config.json');
	self.models = {};
	self.schemas = {};
	self.autoRefesh = true;
	//"mongodb://localhost:27017/canguro-app"
	this.setConfig = function(config){

		if(config.collections!=undefined){
			self["collections"] = config.collections;
		}

		self.active_group = config[config.active_group];
		self.dbname = self.active_group.dbname;
		self.host = self.active_group.host;
		self.port = self.active_group.port;
		self.linkconex = "mongodb://"+self.host+':'+self.port+'/'+self.dbname;
		self.conn = mongoose.connection;
		// global.Msg("Msg", self.linkconex);
	}
	//para emitir eventos ilimitados
	this.setMaxListeners(0);
}

/**
* @Model: name,schema
* Crea una instancia de Model de mongoose
* Devuelve el Model
+ name: String Nombre del Schema
+ schema: Object instancia de mongoose.Schema
*/
function Model(name,schema){
	var model = mongoose.model(name,schema);
	
	for(var s in schema){
		// console.log(s);
	}
	model["schema"] = schema;
	model["getSchema"] =  function(){
		return schema;
	}
	return model;
}
/**
* @Schema: name,config,virtuals
* Crea una instancia de Schema de mongoose
* Devuelve el Schema
+ name: String Nombre del Schema
+ config: Object Campos del Schema
+ virtuals: function (Sin uso por ahora)
*/
function Schema(name,config,virtuals){
	
	function Password(key,options){
		mongoose.SchemaType.call(this,key,options,"Password");
	}
	Password.prototype = Object.create(mongoose.SchemaType.prototype);
	Password.prototype.cast = function(val){
		var _val = md5(val);
		return _val;
	}
	mongoose.Schema.Types.Password = Password;

	//NOTA: Importante establecer las propiedades toObject y toJSON para que funcione.
	var schema = new mongoose.Schema(config,{
	    toObject: { virtuals: true },
	    toJSON: { virtuals: true }
	});
	if(virtuals!=undefined){
		if(virtuals[name]!=undefined){
			for(var key in virtuals[name]){
				var _v = virtuals[name][key];
				if(_v!=undefined){
					/*schema.virtual(_v).get(_v["get"]);
					schema.set(_v["set"]);*/	
				}
			}
		}
	}
	return schema;
}

/*Permite emitir Eventos personalizados*/
ManagerDB.prototype = new events.EventEmitter;

ManagerDB.prototype.getCollections = function(){
	return this.collections;
}
/*
* @ObjectId:_id
* Util para utilizar en los documentos como primary key o
* referencia de oto modelo.
* this.ObjectId(some_id);
*/
ManagerDB.prototype.ObjectId = function(_id){
	return ObjectId(_id);
};

/**
* @parseObject: options,callback
* Convierte un objeto relación con clave valor y tipo
* para campos de esquemas.  
* Los campos estan disponibles en el objeto {this.fieds}
*/
ManagerDB.prototype.parseObject = function(obj){

	var self = this;	
	for(var s in obj){
		var field = obj[s];
		// console.log("field:: ",s,":"+obj[s]);
		if(typeof(field)=='object'){
			if(Array.isArray(field)){
				// console.log("\nisArray: ",field,typeof(field));
				field.forEach(function(item,index){
					// console.log("\tindex"+index,item);
					self.parseObject(item);
				});
			}else{
				if(field.hasOwnProperty("type")){
					if(field.type=='ObjectId'){
						field.type=mongoose.Schema.Types.ObjectId;
					}else if(field.type=='Date' && field.hasOwnProperty("default")){
						if(field.default=='now'){
							field.default = Date.now;
							// field.default = moment().tz(new Date().toLocaleString(),"America/Bogota").format();
							// field.default = new Date().toLocaleString();
						}
					}
				}
				for(var k in field){
					var fieldChild = field[k];
					if(typeof(fieldChild)=='object'){
						// console.log("\tfield:: ",s);
						self.parseObject(field[s]);
					}
				}
			}

			//convert function
			if(typeof(field)=='function'){
				if(s=='convert'){
					console.log("Tiene funcion convert.");
				}
			}
		}
	}
	return obj;
}
ManagerDB.prototype.setFieldsMap = function(options,callback){
	var self = this;
	var fields = {};
	return new Promise(function(resolve,reject){
		if(!fields) fields={};
		for(var s in options){
			var field = options[s];
			if(typeof(field)=='string'){
				// console.log(s+" es un string simple.");
				fields[s] = {type: "String"};
			}else if(typeof(field)=='object'){

				if(Array.isArray(field)){
					// console.log(s+" es array.")
					fields[s] = {type:"Array"};
					field.forEach(function(item,index){
						//var fieldChild = self.setFieldsMap(item);
						var fieldChild = item;

						for(var key in item){
							var subitem = item[key];

							if(subitem.hasOwnProperty("ref")){
								fields[s]["ref"] = subitem.ref;
								// console.log("\tsubitem:",subitem)
							}
						}
						if(fieldChild.hasOwnProperty("ref")){
							fields[s]["ref"] = fieldChild.ref;
							// console.log("\titem:",fieldChild)
						}
					});
				}else{
					if(field.hasOwnProperty("ref")){
						// console.log(s+" es object secundario",s)
						fields[s] = {type:'Object',ref:field["ref"]};
					}else{
						fields[s] = {type:(field.type!=undefined)?field.type:'Object'};
						// console.log(s+" es object principal",s)
					}
				}
			}
		}
		resolve(fields);
	});
}
/**
* @createSchema: name,options,callback
* Crea esquemas, inicializa funciones Estaticas 
* para ser usadas en el modelo para CRUD
* Esta función define los metodos search, create y delete
* Una vez instanciado el schema se emite un evento con el nombre de éste.
* Ejemplo:
* on("NOMBRE_SCHEMA",callback);
*/
ManagerDB.prototype.createSchema = function(name, options,lang,callback){
	var self = this;
	
	
	return new Promise(function(resolve,reject){
		var fields = {};
		self["name"] = name;
		
		if(typeof(options)=='string'){
			options=options.replace("\n","");
			options = options.replace(/\\/g, "");
			try{
				options = JSON.parse(options);
			}catch(e){
				throw "Error al transformar JSON en: "+name+'\n'+e+'\n'+options;
			}
		}
		var raw_config = options;

		/*options.timestamps ={
	        createdAt: 'Date',
	        updatedAt: 'Date'
	    };*/


		
		/*Objeto convertido con parametros de Schema validos para mongoose*/
		if(name!="schema"){
			options=self.parseObject(options);
		}

		/**
		* Emitir evento previo a la creación de Schema.
		*/
		
		self.emit("pre-"+name,options);
		var schema = self.getSchema(name) || Schema(name,options,self.virtuals);
		 /*Mapping de campos del eschema*/
		self.setFieldsMap(options)
		.then(function(fields){
			schema.statics.fields = fields;
		});
		self.schemas[name] = schema;
		self.schemas[name]["name"] = name;
		schema["lang"] = lang;
		// schema["name"] = name;

		schema.statics.getFields = function(){
			return this.fields;
		};
		
		
		schema.statics.set = function(name,value){
			this[name] = value;
		}
		schema.statics.get = function(name){
			return this[name];
		}
		schema.statics.getFieldsMap = function(params){
			var fields = this.getFields();
			var out_fields = (!params)?[]:{};
			
			if(params!=undefined){
				for(var key in fields){
					if(params[key]!=undefined){
						out_fields[key]=params[key];
					}
				}
			}else{
				for(var key in fields){
					out_fields.push(key);
				}
			}
			// console.log(out_fields);
			return out_fields;
		}
		/**
		* @fieldsMap: params,model
		* Se encarga de mapear los parametros de entrada
		* relacionandolos con los campos del esquema.
		* Devuelve el modelo con los datos pasados.
		*/
		schema.statics.fieldsMap = function(params,model){
			var fields = this.getFields();
			var output ={}; 

			return new Promise(function(resolve,reject){
				if(!Helper.isEmpty(params)){
					for(var key in params){
						var field = fields[key];
						var val = params[key];
						if(field!=undefined){
							
							if(field.type == 'Array' || field.type=='Object'){

								output[key] = (field.type == 'Array')?[]:{};
								if(field.ref!=undefined){
									// output[field.ref] = (field.type == 'Array')?[]:{};
									if(typeof(val)=='string'){
										if(field.type=='Array'){
											var item = {};
											item[field.ref] = val;
											output[key].push(item)
										}else{
											output[key]=val;
										}
									}else if(typeof(val)=='object'){
										
										val.forEach(function(record,index){
											var item = {};
											item[field.ref] = record;
											if(field.type=='Array'){
												output[key].push(item)
											}else{
												output[key]=item;
											}
										});
										
									}
								}else{
									if(typeof(val)=='string'){
										output[key].push(val);
									}else if(typeof(val)=='object'){
										val.forEach(function(record){
											output[key].push(record);
										});
									}	
								}
							}else{
								if(field.type=='Date'){
									if(field.default!=undefined){
										if(field.default=='now'){
											output[key] =  moment().tz(new Date().toLocaleString(),"America/Bogota").format();
										}
									}
								}else{
									output[key] = val;
								}
							}
						}else{
							console.log("no definido.",field);
						}
					}
					//Objeto resultante
					if(model!=undefined){
						for(var s in fields){
							if(s!='id' || s!='_id'){
								model[s] = output[s];
							}
							//output[s] = model[s];
							// console.log("\t"+s,model[s])
						}
					}
					resolve(output);
				}else{
					reject("Se requieren parametros de entrada.");
				}
			});
		}
		schema.statics.create = function(params,callback){
			var me = this;
			if(!Helper.isEmpty(params)){
				if(params.id){
					this.findById(params.id,function(err,doc){
						//doc - Representa una instancia del mondelo mongoose.
						if(!doc){ 
							if(callback!=undefined){
							 	callback("No existe registro.");
							 	return;
							}
						};
						params = me.getFieldsMap(params);
						me.fieldsMap(params,doc)
						.then(function(obj_map){
							doc.update(obj_map,doc,function(err,obj_map){
								if(err) throw err;
								if(callback!=undefined) callback(err,obj_map);
							});
						});
					});
				}else{
					var model = this;
					params = this.getFieldsMap(params);
					//El crear de Schemas es diferente 
					this.fieldsMap(params)
					.then(function(obj_map){
					 	var instance = new model(obj_map);//Instancia del Modelo
				 	 	
				 	 	instance.validate(function(err) {

				 	 		if(err){
					 	 	 	if (err.name == 'ValidationError') {
					 	 	 		console.log(err);
						 	 	    if(callback!=undefined){ 
						 	 	    	callback(null,err);
							 	 	    return;
							 	 	}
						 	 	}else {
					 	 	        // A general error (db, crypto, etc…)
			 	 	       	 	    if(callback!=undefined){ 
			 	 	       	 	    	callback(null,err);
			 	 	      	 	 	    return;
			 	 	      	 	 	}
						 	 	}
						 	}

				 	 		//Guardar instancia de Modelo
   					 	 	instance.save(function(err,doc){
   					 	 		if(err){
   	  					 		 	if(callback!=undefined){
   	  					 			 	if(callback!=undefined) callback(doc,err);
   						 		 	}
   					 	 			// throw err;
   					 	 			return;
   					 	 		}
   			 	 		      	if(name=='schema'){
   	  						 		self.autoRefesh = true;
   	  						 		self.refresh(function(){
   	  	 								if(callback!=undefined){
   	  	 									callback(doc)
   	  	 								}
   	  	 							});
   	  						 	}else{
   	  					 		 	if(callback!=undefined){
   	  					 			 	if(callback!=undefined) callback(doc,err);
   						 		 	}
   	  						 	}
   					 	 	});  
				 	 	  	
				 	 	});
				 	 	
					},function(err){
					 	if(callback!=undefined) callback(err);
					});
				}
			}else{
				if(callback!=undefined) callback("No se encontraron parametros de entrada."); 
			}
		}	
		schema.statics.query = function(params,callback){
			var query = null;
			if(params._id){
				query = this.findById(params._id,function(err,doc){
					if(callback!=undefined) callback(err,query);
					console.log("query "+name+":",params);
					return query;
				});
			}else{
				params = this.getFieldsMap(params);
				query = this.find(params,function(err,docs){
					if(callback!=undefined) callback(err,query);
					console.log("query "+name+":",params);
					return query;
				});
			}
		}
		schema.statics.search = function(params,callback){
			if(params._id){
				this.findById(params._id,function(err,doc){
					if(!doc){
						if(callback!=undefined){ callback(err,doc); return;}
					
					}
					if(callback!=undefined) callback(err,doc);
					return doc;
				});
			}else{
				params = this.getFieldsMap(params);
				this.find(params,function(err,docs){
					if(callback!=undefined) callback(err,docs);
					return docs;
				});
			}
		}
		schema.statics.findOneById = function(id,callback){
			if(!id){
				if(callback!=undefined) callback();
			}else{
				this.findById(id,function(err,doc){
					if(callback!=undefined) callback(err,doc);
				});
			}
		}
		schema.statics.removeById = function(id,callback){

			if(id){
				this.findByIdAndRemove(id,function(err,doc){
					if(!doc){
						if(callback!=undefined) callback("No existe registro."); 
					}else{
						if(callback!=undefined) callback("Registro eliminado.",doc);
					}
				});
			}else{
				/*if(!Helper.isEmpty(params)){
					this.remove(params,function(err,doc){
						if(!doc){
							if(callback!=undefined) callback("No existe registro."); 
						}else{
							if(callback!=undefined) callback("Registro eliminado.",doc);
						}
					});
				}else{
				}*/
				if(callback!=undefined) callback("No se encontraron parametros de entrada."); 
			}
		}
		
		/**
		* Emitir evento de Schema creado.
		+ #on
		*/
		self.emit(name,schema);
		//register Schema
		resolve(schema)
	});
}

/**
* @createModel: name,schema,callback
* Crea modelos, los modelos manejan la relación con la base 
* de datos, proporcianan todos los eventos y metodos accesibles 
* en la API de mongoose.
*/
ManagerDB.prototype.createModel = function(name,schema,callback){
	var self = this;
	var model = this.getModel(name) || new Model(name,schema);
	this.models[name] = model; 
	this.models[name]["name"] = name;

	this[name] = model;
	if(callback!=undefined){
		callback(model);
	}
	/**
	* Emitir eventos para el manejador de la base de datos
	* y para el Schema, ambos reciben como parametro el modelo instanciado.
	*/
	if(name=="schema"){
		self.emit("define",name,model);
		schema.emit("define",model);
	}	

	return model;
}
/*
* @create: {name,options},callback
+ name:String Nombre del Modelo
+ options:object Parametros del Modelo
+ callback:function Funcion de Devolución
* Crea una instancia de un modelo y guarda sus valores.
* [Devuelve] la instancia creada y el modelo.
* Útil par crear un Schema inexistente en la base de datos.
**/
ManagerDB.prototype.create = function({name,options},callback){

	var self = this;
 	var schema = this.getSchema(name);
 	var model = this.createModel(name,schema);

 	//Crear nueva instancia de modelo
 	var instance = new model(options);
 	instance.save(function(){
	 	if(callback!=undefined){
		 	callback(instance,model);
	 	}
 	});
	return instance;
}
/**
* @load callback
* Carga el archivo de configuración de la base de datos
* database/config.json
*/
ManagerDB.prototype.load =  function(callback) {
	var self = this;
	return new Promise(function(resolve,reject){
		

		Helper.readFile(self.url)
		.then(function(config){
			self.setConfig(config);
			resolve(config);
		},function(err){
			console.log("Error al cargar archivo de base de datos.");
			reject(err);
			
		});	
	});
}
/**
* @register name,config,lang,callback
* Inserta documentos en la Colleción Schemas.
* Si ya existe el registro lo actualiza.
*/
ManagerDB.prototype.register = function(name,config,lang,callback){
	var self = this;
	//Registra esquema en la collection schema
	if(name!="schema"){
		var model = this.getModel("schema");//obtener modelo Schema
		var params ={"name":name,"config":config};

		model.findOne({"name":name},function(err,doc){

			if(!doc){
				//Crear Schema en base de datos
				self.create({
					name:"schema",
					lang:lang, 
					options:{"name":name,"lang":lang,"config":config}
				},function(){

					//Actualizar los esquemas de la base de datos
					
					self.refresh(function(){
						console.log("Se registró el esquema: ",name+".")
						if(callback!=undefined){
							callback((!doc))
						}
					});
					
				});
				
			}else{
				//Establecer el lenguaje del Schema
				
				console.log(name,"registrado.")
				if(callback!=undefined){
					callback((!doc))
				}
			}
					
		});
	}else{
		if(callback!=undefined){
			callback(false)
		}
	}
};
/*
* @define: callback
* Crea nuevas instancias de Modelos 
* con su respectivo Schema registrado en collection Schemas
*/
ManagerDB.prototype.define =  function() {

	var self = this;
	return new Promise(function(resolve,reject){
		//Crear el Esquema principal de la base de datos, que contiene todos los esquemas.
		self.createSchema("schema",{name:{type:"String","unique":true},lang:{"type":"String","default":"es"}, config:"String"},"es")
		.then(function(schema){
			//Instancia modelo Schema
			var model = self.createModel(schema.name,schema);
			
			//Cargar Schemas de la base de Datos y generar Modelos
			console.log("Cargando Schemas...");
			// global.Msg("Atención","Cargando Schemas...");
			model.find(function(e,docs){
				if(docs.length>0)
				{
					// global.Msg("Atención","defineSchemas: "+docs.length);
					self.defineSchemas(docs)
					.then(function(){
						// global.Msg("Atención","END defineSchemas: "+docs.length);
						self.autoRefesh = true;
						resolve();
					});
				}else{
					// global.Msg("Atención","defineCoreSchemas");
					self.defineCoreSchemas()
					.then(function(){
						self.autoRefesh = true;
						resolve();
					});
				}
			});
		},function(err){
			// global.Msg("Error","Error al crear esquema");
			console.log("Error al crear esquema");
			reject(err);
		});
	});
}
ManagerDB.prototype.defineCoreSchemas = function(callback){
	
	var self = this;
	self.autoRefesh = false;
	var schemas = self.getCollections();
	var model = self.getModel("schema");
		
	return new Promise(function(resolve,reject){

		self.defineSchemas(schemas)
		.then(function(){
			console.log("Se crearon los esquemas del core.");
			resolve();
		});
	});
}
ManagerDB.prototype.defineSchemas =  function(schemas) {

	var self = this;
	var count =1;
	return new Promise(function(resolve,reject){

		schemas.forEach(function (doc,index,arr) {

			//Registrar los esquemas en collection Schemas
			self.register(doc.name,doc.config,doc.lang,function(){
				//Crear Esquema con la configuración registrada.
				self.createSchema(doc.name,doc.config,doc.lang)
				.then(function(sch){
					//Crea nueva instancia de modelo
					self.createModel(doc.name,sch,function(m){
						
						/**
						* Emitir eventos para el manejador de la base de datos
						* y para el Schema, ambos reciben como parametro el modelo instanciado.
						*/

						if(doc.name!="schema"){
							self.emit("define",doc.name,m);
							sch.emit("define",m);
						}

						// global.Msg("index: ", index+"="+(arr.length-1));
						if(index==(arr.length-1)){
							resolve();
						}
						count++;
					});
				});
			});
		});	
	});
}
ManagerDB.prototype.refresh =  function(refresh, callback) {
	var self = this;
	if(typeof(refresh)=='function'){
		callback = refresh;
		refresh = self.autoRefesh;
	}
	refresh = refresh || self.autoRefesh;
	if(refresh){
		//Registrar los schemas de la base de datos

		self.define()
		.then(function(){
			console.log("ManagerDB Ready.")
			self.emit("ready");
			if(callback!=undefined){
				callback();
			}
		},function(){
			if(callback!=undefined){
				callback();
			}
		});
		console.log("refresh.");
	}else{
		if(callback!=undefined){
			callback();
		}
	}
}
/**
* @connect: callback
* Conecta con la base de datos MongoDB
* utilizando la propiedad linkconex de ManagerDB.
* Una vez conectado, procede a crear el esquema base
* "schema", luego crea una instancia del modelo schema.
* consulta los registros, para crear los esquemas
* y modelos de cada registro.
* La composición base de un esquema es:
+ name:String
+ config: String
* name: Representa el nombre del Schema
* config: Almacena un String en formato Json, con la
* configuración del schema.
*/
ManagerDB.prototype.connect =  function(callback) {
	var self = this;
	return new Promise(function(resolve,reject){


		Helper.readFile(self.url)
		.then(function(config){
			
			self.setConfig(config);
			
			var state = mongoose.connection.readyState;
			console.log("Status: ",state);
			
			mongoose.connect(self.linkconex,{ useMongoClient: true });

			mongoose.connection.once("connected", function() {
			    /**
			    * Definir los schemas de la base de datos
			    */
			    // return;
			    // global.Msg("connected", self.linkconex);
			    self.define()
			    .then(function(){
			    	console.log("ManagerDB Ready.")
			    	self.emit("ready");
			    	// global.Msg("Wii!!", "Defined Schemas.");
			    	resolve("Conectado a la base de datos.");
			    },function(){
			    	console.log("Conectado a la base de datos. No hay esquemas para definir.")
			    	reject("Conectado a la base de datos. No hay esquemas para definir.");
			    	// global.Msg("Error!!", "Conectado a la base de datos. No hay esquemas para definir.");
			    });
			    console.log("Connected to " + self.linkconex);
			});

			mongoose.connection.on("error", function(error) {
			    console.log("Connection to " + self.linkconex + " failed:" + error);
			    global.socket.emit("mongo-connected",err);
			    reject(err);
			    return;
			});

			mongoose.connection.on("disconnected", function() {
			    console.log("Disconnected from " + self.linkconex);
			});

			process.on("SIGINT", function() {
			    mongoose.connection.close(function() {
			        console.log("Disconnected from " + self.linkconex + " through app termination");
			        process.exit(0);
			    });
			});
			
		},function(err){
			console.log("Error al cargar archivo de base de datos.");
			reject(err);
			
		});	

	});
}
/**
*@disconnect: callback
* Desconecta de la base de datos
*/
ManagerDB.prototype.disconnect = function(callback) {
	mongoose.disconnect(callback);
}
/**
* @getSchema: name
* Devuelve un Schema registrado en la colección schemas de ManagerDB.
*/ 
ManagerDB.prototype.getSchema = function(name){
	return this.schemas[name];
}
/**
* @getSchemasMaps
* Devuelve un objeto que contiene todos los Schemas registrados en el objeto schemas de ManagerDB.
*/ 
ManagerDB.prototype.getSchemasMaps = function(){
 	return this.schemas;
}
/**
* @getSchemas
* Devuelve un array con todos los Schemas registrados en el objeto schemas de ManagerDB.
*/ 
ManagerDB.prototype.getSchemas = function(){
	var schemas = [];
	for(var key in this.schemas){
		schemas.push(this.schemas[key]);
	}
 	return schemas;
}
/**
* @getModel: name
* Devuelve un Modelo registrado en la colección models de ManagerDB.
*/ 
ManagerDB.prototype.getModel = function(name){
	return this[name];
}