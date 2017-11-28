//require('./main.js')
const path = require('path')
const url = require('url')
var server = require('./server/app');
var Constants = require("./server/helpers/Constants.js");
var Helper = require("./server/helpers/helper");
var app_config = path.join('server','app.json');

global.APP_PATH = __dirname;

function loadConfig(callback){
	Helper.readFile(app_config)
	.then(function(obj){
		// Helper.writeFile(app_config,obj);
		if(callback!=undefined){
			callback(obj);
		}
	},function(err){
	    if(err){
	        throw err;
	    }
		// Helper.writeFile(app_config,obj);
		if(callback!=undefined){
			callback({});
		}
	});
}

loadConfig(function(config){
	server(config)
	.then(function(){
		console.log("Aplicación Iniciada.",__dirname)
	
	},
	function(err){
	    
	    if(err){
	        throw err;
	    }
		
	});
});