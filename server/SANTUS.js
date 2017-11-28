var express = require("express");
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var router = express.Router();
var dateFormat = require('dateformat');
var streaming = require("./js/videoStreaming");
var pluralize = require("./helpers/helper").pluralize;
var path = require('path');
var md5 = require('md5');

module.exports = function(app,db){

	
	var camera = streaming({
		id_dispositivo:2,
		address: '192.168.1.155',
		folder:'/public/',
		prefix:'',
		port: '80',
		username: 'root',
		password: 'root'
	}); 

	var video = camera.createRecord({
		resolution: '800x450',
		videocodec:'h264',
		folder:'./public/videos/',
		prefix:'czbq',
		audio:0,
		fps:25,
	});
	//DESPLIEGUE
	router.route("/logout")
	.get(function(req,res){
		req.session.destroy(function(err){
			if(err) res.send(err);
			res.send(JSON.stringify({
				success:true,
				msg:"Session finalizada."
			}));
		});
	});
	router.get("/image/new",(req,res)=>{
		camera.requestImage({
			resolution: '1920x1080',
			compression: 30,
			rotation: 0,
			folder:'/public/images/'
		}, function(err, data) {
			if (err) throw err;
			res.send(JSON.stringify({
				success:true,
				msg:'Imagen capturada!'
			}));
		});
	});
	router.get("/video",(req,res)=>{
		var action = req.query.action;
		var params = req.query;
		
	 	video.record(params,function(){
			console.log("end.");
			res.send(JSON.stringify({
				success:true,
				msg:'Video creado con éxito',
				url:video.filename
			}));
			video.stop();
	 	});
	});
	router.route("/video/:action")
	.get(function(req,res){
		var params = req.params,
		action = params.action;

		switch(action){
			case 'stop':
				var rec = video.stop(function(record){
					res.send(JSON.stringify({
						success:true,
						msg:'Video detenido.'
					}));
				});
			break;
		}
	});
	//Schemas
	db.on("schema",function(schema){

		router.route("/schemas").post(function(req,res){
			
			var params = req.body;
			
			if(params.id){
				db.schema.findById(params.id,function(err,schema){
					
					if(!schema){
						res.send(JSON.stringify({
							success:false,
							msg:'Esquema no existe.',
						}));
						return;
					}

					schema.name = params.name;
					schema.config = params.config;
					schema.lang = params.lang;

					schema.save(function(err,doc){
						res.send(JSON.stringify({
							success:true,
							msg:'Esquema actualizado con éxito. ',
							url:doc.url
						}));
					});
				});
			}else{
				db.register(params.name,params.config,function(err,doc){
					res.send(JSON.stringify({
						success:err,
						msg:(err)?doc:'el esquema ya existe.'
					}));
				});	
			}	
		});
		router.route("/schemas").get(function(req,res){
			db.schema.search(req.query,function(err,docs){
				res.send(JSON.stringify(docs));
			});
		});
		router.route("/schemas/delete").get(function(req,res){
			var model = db.getModel("schema");

			console.log("Se va a eliminar ",req.query);
			//Elimina el registro de collection schema
			db.schema.removeById(req.query.id,function(err,doc){
				console.log(err,doc);
				db.getModel(schema.name).collection.drop(function(){
					db.refresh(function(){
						res.send(JSON.stringify(doc));
					});
				});
			});
		});

	});
	//Videos
	db.on("video",function(schema){
		router.route("/videos").get(function(req,res){
			var params = req.query;
			db.video.query(req.query,function(err,query){
				query.populate('creator','_id')
				.select('_id filename creator url')
				.exec(function(err,data){
					res.send(JSON.stringify(data));
				});
			});
		});
	});
	//Modules
	db.on("module",function(schema){
		//Ejemplo de Virtual
		schema.virtual("alias").get(function(){
			return (this.name)?"widget-"+this.name:undefined;
		});
		router.route("/modules").get(function(req,res){
			var params = req.query;
			db.module.find(params,function(err,data){
				res.send(JSON.stringify(data));
			});
		});
	});
	//Users
	db.on("user",function(schema){
		//Ejemplo de Virtual
		schema.virtual("alias").get(function(){
			return this.username+"-lord";
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

		router.route("/user").get(function(req,res){
			db.user.query(req.query,function(err,query){
				
				query.populate('usergroup')
				.select('username email usergroup modules')
				.exec(function(err,data){

					var modules = [];
					data.forEach(function(user){

						user.usergroup.modules.forEach(function(docs,index,arr){
							console.log(docs.module)
							db.module.find(docs.module,(err,doc)=>{
								console.log("encotrado",doc)
								user.usergroup.modules[index]=doc;
								console.log("doc: "+index)

								res.send(JSON.stringify({data:data}));
							});
						});						
					});
					console.log("cierre")	
					
				});
			});
		});

		router.route("/users").get(function(req,res){
			db.user.listar(req.query,function(docs){
				res.send(JSON.stringify({data:docs,success:true}));
			});
		});
		router.route("/users").post(function(req,res){
			var params = req.body;
			
			if(params.password!=undefined){
				params.password=md5(params.password)
			};
			db.user.create(params,function(err,doc){
				if(!doc){
					res.send(JSON.stringify({"success":false,"msg":err}));
				}else{
					res.send(JSON.stringify({
						"success":true,
						"msg":(!params.id)?"Usuario creado con éxito.":"Usuario actualizado con éxito."
					}));
				}
			});
		});
	});
	//Groups
	db.on("group",function(schema){

		router.route("/groups").get(function(req,res){
			db.group.query(req.query,function(err,query){
				
				query.populate('modules')
				.populate('modules.module')
				.exec(function(err,data){
					res.send(JSON.stringify(data));
				});
			});
		});
	});


	/**
	* @params: name, schema
	* Crea dinamicamente las rutas para
	* Acceder a las funciones CRUD de modelos de manera Simple.
	* Se desea agregar nueva funcionalidad, debe sobre escribir las rutas
	* o crear rutas personalizadas, los esquemas estan disponibles
	* En el evento on("NOMBRE_SCHEMA",callback);
	*/

	var Schema;
	db.on("define",function(name,schema){
		
		if(name == "schema") schema.lang="es";
		var route_name = pluralize(schema.lang || "es",name);
		route_name = path.join('/',route_name);
		console.log("route: ",name,route_name);

		setSchema = function(name,schema){
			
			Schema = schema;

			list = function(req,res){
				var params = req.query || {};
				console.log(params);
				db[name].search(params,function(err,docs){
					console.log("GET: list "+route_name,docs);			
					res.send(JSON.stringify({data:docs}));
				});
			}
			update = function(req,res){
				res.send(JSON.stringify({"success":true,"msg":"update"}));
			}
			findById = function(req,res){
				res.send(JSON.stringify({"success":true,"msg":"findById"}));
			}
			save = function(req,res){
				var params = req.body;
				db[name].create(params,function(err,doc){
					console.log("GET: save "+route_name);
					if(!doc){
						res.send(JSON.stringify({"success":false,"msg":err}));
					}else{
						res.send(JSON.stringify({
							"success":true,
							"msg":(!params.id)?"Registro creado con éxito.":"Registro actualizado con éxito."
						}));
					}
				});
			}
			remove = function(req,res){
				db[name].removeById(req.params.id,function(msg,doc){
					console.log("GET: remove "+route_name);
					res.send(JSON.stringify({
						success:true,
						msg:msg
					}));
				});
			}	
			
			router.route(route_name).get(list);//Listar y Buscar
			router.route(route_name).post(save);//crear registro nuevo y actualizar
			router.route(route+':id').get(findById);//busca un registro por Id
			router.route(route+'/delete/:id').post(remove);//Eliminar registro por Id
		}
		setSchema(name,schema);
		
	});

	return router;
};