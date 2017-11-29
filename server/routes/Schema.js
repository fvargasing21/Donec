var Helper = require("../helpers/helper");
var md5 = require("md5");
var path = require('path');
const config_database = path.join(global.APP_PATH,'server','database','config.json');
module.exports = function(app,io,db,schema){

	db.on("schema",function(schema){
		
		app.get("/schemas",function(req,res){
			db.schema.search(req.query,function(err,docs){
				res.send(JSON.stringify(docs));
			});
		});
	});
	app.post("/schemas",function(req,res){
		var params = req.body;
		db.schema.create(params,function(doc,err){
			var msg = (params.id!=undefined)?"Esquema actualizado.":"Esquema creado con éxito.";

			if(err){
				res.send(JSON.stringify({"success":false,"msg":err}));
				return;
			}

			if(!doc){
				res.send(JSON.stringify({"success":false,"msg":err.errmsg}));
			}else{

				var _collections=[];
				Helper.readFile(config_database).
				then(function(config){
					config.collections.push(params);
					console.log(config.collections);
					_collections = config.collections;
					// res.send(JSON.stringify({"success":true,"msg":msg}));
					// config = JSON.stringify(config);

					config.collections.forEach(function(item,index){
						item.config = JSON.parse(item.config);
						item.config = JSON.stringify(item.config);
					});

					Helper.writeFile(config_database,config)
					.then(function(){
						console.log("Archivo de configuración actualizado.",config);
						res.send(JSON.stringify({"success":true,"msg":msg}));
					},function(err){
						console.log("No se pudo modificar el archivo de configuración.");
						res.send(JSON.stringify({"success":false,"msg":"No se pudo modificar el archivo de configuración."}));
					});
				},function(err) {
					res.send(JSON.stringify({"success":false,"msg":err}));
				});
				console.log("_collections: ",_collections);
				/*Helper.writeFile(config_database,config)
				.then(function(){
					console.log("Archivo de configuración actualizado.",config);
					res.send(JSON.stringify({"success":true,"msg":msg}));
				},function(err){
					console.log("No se pudo modificar el archivo de configuración.");
					res.send(JSON.stringify({"success":false,"msg":"No se pudo modificar el archivo de configuración."}));
				});*/
			}

		});					
	});
	app.put("/schemas/:_id",function(req,res){
		var params = req.params;
		db.schema.create(params,function(doc){
			console.log("PUT: update schemas");
			if(!doc){
				res.send(JSON.stringify({"success":false,"msg":err}));
			}else{
				res.send(JSON.stringify({
					"success":true,
					"msg":(!params._id)?"Registro creado con éxito.":"Registro actualizado con éxito."
				}));
			}
		});			
	});
	app.get("/refresh",function(req,res){
		db.refresh(function(err,schema){
			res.send("Aplicaión actualizada.");
		});
	});
}