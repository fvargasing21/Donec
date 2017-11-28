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

	return router;
}