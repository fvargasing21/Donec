var md5 = require("md5");

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

			if(!doc){
				res.send(JSON.stringify({"success":false,"msg":err.errmsg}));
			}else{
				res.send(JSON.stringify({"success":true,"msg":msg}));
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