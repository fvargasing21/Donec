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