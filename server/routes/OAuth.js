var md5 = require("md5");
var Helper = require("../helpers/helper");
var Constants = require("../helpers/Constants");
const path = require('path');
var app_config = path.join(global.APP_PATH,'public','config','app.json');

module.exports = function(app,io,db){
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
						if(err) { res.send(err); return; }
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
					if(!doc){
						console.log("No existe el grupo.")
						// global.Msg("Atención","No existe el grupo.");
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
										"username":params.username,
										"email":params.email || '',
										"instaled_at":new Date()
									}
									delete params.password;
									delete params.email;
									delete params.username;

									for(var key in params){
										obj[key] = params[key];
									}
									Helper.writeFile(app_config,obj)
									.then(function(){
										console.log("Archivo de configuración creado.",obj);
										resolve(obj);
									},function(err){
										reject("No se pudo crear el archivo de configuración.");
										global.Msg("Error",err);
										console.log("No se pudo crear el archivo de configuración")
									});
									
								});
							});
						});
					}else{
						reject("Puede que el Sistema ya este instalado<br>Inicar Sesión como Super Administrador.")
						// res.send(JSON.stringify({
						// 	"success":true,
						// 	"msg":"Puede que el Sistema ya está instalado<br>Inicar Sesión como Super Administrador.",
						// }));
					}
				});
			});
		}

		install(params)
		.then(function(obj){
			//Actualizar variables Globales
			global.config = obj;
			res.send(JSON.stringify({
				"success":true,
				"msg":"Archivo de configuración creado.",
				"user":obj
			}));
		},function(err){
			// global.Msg("Atención","No se pudo crear el archivo de configuración");
			res.send(JSON.stringify({
				"success":false,
				"msg":err
			}));
		});
	});
	app.post("/config",function(req,res){

		var params = req.body;

		Helper.readFile(app_config).
		then(function(config){

			for(var key in config){
				if(typeof(config[key])=='object'){
					for(var s in config[key]){
						if(params[s]!=null){
							config[key][s] = params[s];
						}
					}
				}else{
					if(params[s]!=null){
						config[key]=params[key];
					}
				}
			}
			for(var key in params){
				if(params[s]!=null){
					config[key] = params[key];
				}
			}
			console.log(config);
			Helper.writeFile(app_config,config).
			then(function(){
				res.send({
					"success":true,
					"msg":"Configuración Actualizada con éxito.",
					"config":config
				});
			},function(err){
				res.send({
					"success":false
				});
			});

		});
	});
	app.get("/config",function(req,res){
		Helper.readFile(app_config).
		then(function(config){
			res.send({
				"success":(!Helper.isEmpty(config)),
				config
			});
		},function(err){
			res.send({
				"success":false
			});
		});
	});
	app.post("/change_password",function(req,res){
		var params = req.body;

		console.log(params);
		db.user.findById(req.session.user_id,function(err,doc){
			if(err){
				res.send({
					"success":false,
					"msg":"No exite usuario en la sesión."
				});
				return;
			}
			if(doc.password!=md5(params.current_password)){
				res.send({
					"success":false,
					"msg":"Contraseña actual invalida."
				});
				return;
			}
			doc.password = md5(params.password);
			doc.save(function(err,doc){
				req.session.destroy(function(err){
					if(err) { res.send(err); return; }
					res.send({
						"success":(!err),
						"msg":"Contraseña Actualizada."
					});
				});
			});
		});
	});
}
