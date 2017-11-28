var md5 = require("md5");
//Users 
module.exports = function(app,io,router,db,schema){
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
		        user.usergroup.modules.forEach(function(docs,index,arr){
		        	db.module.findOne(docs.module,(err,doc)=>{
		        		user.usergroup.modules[index]=doc;
		        	});
		        });
				result.push(user);
	      	})
	    	.then(res => {
	    		callback(result);
	    	});				
		});
	}
	// console.log("USER::: ",user.fields());
	router.route("/users").get(function(req,res){
		db.user.listar(req.query,function(docs){
			res.send(JSON.stringify({data:docs,success:true}));
		});
	});
	router.route("/users").post(function(req,res){
		var params = req.body;
		console.log("Actualizar usuario");
		if(params.password!=undefined){
			params.password=md5(params.password)
		};

		if(!params.usergroup || !params.username){
			res.send(JSON.stringify({
				"success":false,
				"msg":"Debe especificar un grupo o nombre de usuario."
			}));
			return;
		}

		if(params.id!=undefined && params.id!=''){
			db.user.findOne({"_id":params.id})
			.then(function(user){
				if(!user){
					res.send(JSON.stringify({
						"success":false,
						"msg":"El usuario no existe."
					}));
				}else{

					db.user.create(params,function(err,doc){
						res.send(JSON.stringify({
							"success":true,
							"msg":(!params.id)?"Usuario creado con éxito.":"Usuario actualizado con éxito."
						}));
					});
				}
			});
		}else{
			db.user.findOne({"username":params.username})
			.then(function(user){
				if(!user){

					db.group.findOneById(params.usergroup,function(err,doc){
						if(!doc){
							res.send(JSON.stringify({
								"success":false,
								"msg":"El grupo de usuario no existe."
							}));
						}else{
							db.user.create(params,function(err,doc){
								res.send(JSON.stringify({
									"success":true,
									"msg":(!params.id)?"Usuario creado con éxito.":"Usuario actualizado con éxito."
								}));
							});
						}
					});
				}else{
					res.send(JSON.stringify({
						"success":false,
						"msg":"No se pudo crear porque el usuario ya existe."
					}));
				}
			})
		}
		
	});
	return router;
}