var md5 = require("md5");
var Helper = require("../helpers/helper");
var path = require("path");

var app_config = path.join(global.APP_PATH,'public','config','app.json');
//const service = require("../services/index");
var socket;
module.exports = function(app,io,db){


	io.on("connect",function(_socket){
		socket = _socket;
	});
	//Evento Constructor User - Se dispara cuando el Schema user ha sido instanciado.
	db.on("user",function(schema){
		//Extendemos la funcionalidad del Schema para usar en el Modelo User.
		schema.statics.login = function(params){

			var self = this;
			return new Promise(function(resolve,reject){
				 
				 var result={};
				 self.findOne(params)
				.populate('usergroup')
				.select('username email usergroup modules')
				.cursor()
				.eachAsync(function(user) {
					//Si hay datos entra a recorrer
			        user.usergroup.modules.forEach(function(docs,index,arr){
			        	db.module.findOne(docs.module,(err,doc)=>{
			        		if(err){
			        			throw err;
			        		}
			        		user.usergroup.modules[index]=doc;
			        	});
			        });
					//user.usergroup.modules=modules;
			        resolve(user);
		      	})
				.then(function(data){
					reject("Usuario y/o contraseña invalidos.");
				});
			});
		}
		schema.on("define",function(model){

			app.get("/logout",function(req,res){
				if(req.session.user_id){
					req.session.destroy(function(err){
						if(err){ res.send(err); return false};
						res.send(JSON.stringify({
							success:true,
							msg:"Session finalizada."
						}));
					});
				}else{
					res.send(JSON.stringify({
						success:false,
						msg:"No existe sisión de usaurio."
					}));
				}
			});
			app.get("/login",function(req,res){
				var params = req.query;
				if(!db.user){
					res.send(JSON.stringify({
						success:false,
						msg:'No se ha creado el esquema user <br>Contacte con el administrador.'
					}));
				}else{
					//Llamar funcion login del Modelo user
					db.user.login({"username":params.username,"password":md5(params.password)})
					.then(function(user){

						//console.log(req.session.secret);
						//var token = service(user,req.session.secret);
						req.session.user_id =user._id;
						res.locals.user = user;

						global.user = user;
						
						res.send(JSON.stringify({
							"user":user,
							// "token":token,
							"success":true
						}));
					}).catch((err)=>{
			            res.send(JSON.stringify({"msg":err,"success":false}));
			        });
				};
			});
			
		});
	});
	app.post("/install",function(req,res){
		var params = req.body;
		function install(params){

			return new Promise(function(resolve,reject){
				console.log("Crear usuario Super User");
				if(!params.password || !params.username){
					res.send(JSON.stringify({
						"success":false,
						"msg":"No se definió un usuario."
					}));
					return;
				};
				db.group.findOne({name:"Super User"},function(err,doc){
					if(err) { throw err; }
					if(!doc){
						console.log("No existe el grupo.")
						db.module.create({
							config:"{\"title\": \"Usuarios\",\"config\": {\"className\":\"Admin.view.users.Users\",\"alias\":\"users\",\"iconCls\":\"fa fa-folder\"}}",
							name:"Usuarios"
						},function(module){
							db.group.create({
								name:"Super User",
								modules:module.id
							},function(group){
								db.user.create({
									"username":params.username,
									"password":md5(params.password),
									"usergroup":group.id,
									"email":params.email || ''
								},function(user){

									var obj = {};
									obj["user"] = {
										"username":user.username,
										"email":user.email
									}
									
									delete params.password;
									delete params.re_password;
									for(var key in params){
										if(!(key in obj["user"])){
											obj[key] = params[key];
										}
									}
									console.log("se va a setear config: ",obj)
									Helper.writeFile(app_config,params,{spaces: 2, EOL: '\r\n'})
									.then(function(err){
										if(err){
											res.send(JSON.strinpagify({
												"success":false,
												"msg":"Error al Escribir archivo."
											}));
											socket.emit("message","Error al Escribir archivo.");
											console.log("Error al Escribir archivo.");
											return;
										}
										res.send(JSON.stringify({
											"success":true,
											"msg":"Usuario creado con éxito.",
											params
										}));
										socket.emit("message","Archivo de configuración creado.");
										console.log("Archivo de configuración creado.")
									},function(){
										res.send(JSON.stringify({
											"success":false,
											"msg":"No se pudo crear el archivo de configuración"
										}));
										socket.emit("message","No se pudo crear el archivo de configuración");
										console.log("No se pudo crear el archivo de configuración")
									});
									
								});
							});
						});
					}else{
						res.send(JSON.stringify({
							"success":true,
							"msg":"Puede que el Sistema ya está instalado<br>Inicar Sesión como Super Administrador.",
						}));
					}
				});
			});
		}

		install(params)
		.then(function(){
			console.log("Instalación completada.")
		});
	});
	app.post("/config",function(req,res){

		var params = req.body;

		Helper.readFile(app_config)
		.then(function(config){

			for(var key in config){
				if(typeof(config[key])=='object'){
					for(var s in config[key]){
						config[key][s] = params[s];
					}
				}else{
					config[key]=params[key];
				}
			}

			socket.emit("message","file read ",app_config+JSON.stringify(config));
			Helper.writeFile(app_config,config).
			then(function(config){
				res.send({
					"success":true,
					"msg":"Configuración Actualizada.<br>Se debe cerrar la sesión e iniciar nuevamente, para reflejar los cambios.",
					config
				});
				socket.emit("message","file write ",app_config+JSON.stringify(config));
			},function(err){
				socket.emit("message","faile to write file ",app_config+":"+err+""+JSON.stringify(config));
				res.send({
					"success":false
				});
			});

		},function(err){
			res.send({
				"success":false,
				"msg":err
			});
		});
	});
	app.get("/config",function(req,res){

		/*db.user.listar({},function(docs){
			if(docs.lenght>0){
				res.send({
					"success":(docs.lenght>0),
					docs
				});
			}else{
				res.send({
					"success":(docs.lenght>0),
					"msg":"El aplicativo está listo para ser istalado."
				});
			}
			console.log(docs);
		})*/
		
		Helper.readFile(app_config)
		.then(function(config){
			socket.emit("message","file read ",app_config+JSON.stringify(config));
			res.send({
				"success":(!Helper.isEmpty(config)),
				config
			});
		},function(err){
			socket.emit("message","faile to read file ",app_config+JSON.stringify(config));
			if(err){
				res.send({
					"success":false,
					"msg":"No se pudo cargar el archivo de configuración."
				});
			}
		});
	});
}