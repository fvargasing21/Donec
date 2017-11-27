var md5 = require("md5");
//Users
module.exports = function(app,io,router,db,schema){
	//Ejemplo de Virtual
	schema.virtual("alias").get(function(){
		return this.name+"-lord";
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

	/*router.route("/users").post(function(req,res){
		var params = req.body;
		console.log("Actualizar grupo");
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
	});*/
	return router;
}