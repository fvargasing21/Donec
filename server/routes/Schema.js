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
		db.schema.create(params,function(doc,model){
			res.send(JSON.stringify(doc));
		});					
	});
	app.get("/refresh",function(req,res){
		db.refresh(function(err,schema){
			res.send("Aplicaión actualizada.");
		});
	});
}