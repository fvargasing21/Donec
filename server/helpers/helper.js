/**
* @Helpers: Funciones para reutilizar
*/
var pluralizeES= require('pluralize-es');
var pluralizeEN = require('pluralize');
var capitalize = require('string-capitalize');
var jsonfile = require('jsonfile')
const fs = require("fs");


function getFilesizeInBytes(filename) {
    const stats = fs.statSync(filename)
    const fileSizeInBytes = stats.size
    return fileSizeInBytes
}

module.exports = {
	CONFIG_DB:"./database/ManagerDB",
	APP_CONFIG:'./server/app.json',
	isEmpty:function(obj){
	  var empty=true;
	  if(obj!=undefined){
	  	for(var key in obj){
		    if(obj[key]!=undefined){ empty=false; break;}
		}
	  }
	  return empty;
	},
	pluralize:function (lang,val){
		var _val = val;
		switch(lang){
			case "es":
				_val=pluralizeES(_val);
			break;
			case "en":
				_val=pluralizeEN(_val);
			break;
		}
		return _val;
	},
	capitalize:function(str){
		return capitalize(str);
	},
	readFile:function(file){

		return new Promise(function(resolve,reject){
			if (!fs.existsSync(file)) {

			    reject("El archivo no existe.");
			    return;
			}else{
				if(getFilesizeInBytes(file)==0){
					console.log(getFilesizeInBytes(file)==0);
					reject("El archivo está vacio.");
					return;
				}
			}	
			try{
				jsonfile.readFile(file,function(err,obj){
					if(err){ reject(err); return;}

		    		//global.socket.emit("message","read file "+file);
					resolve(obj);

				});
				console.log("read file: ",file);
			}catch(err){
				//global.socket.emit("error","Faile to read file "+file)
				console.log("faild read file: ",file);
				reject(err);	
			}
		});
	},
	writeFile:function(file,obj){
		if (!fs.existsSync(file)) {
		    reject("El archivo no existe.");
		    //global.socket.emit("Error al Escribir archivo.");
		    return;
		}
		return new Promise(function(resolve,reject){
			
			try{

				jsonfile.writeFile(file,obj,{spaces: 2, EOL: '\r\n'},function(err){
					if(err){ reject(err); return;}
		    		//global.socket.emit("message","El archivo no existe.");
					console.log("write file:",file);
					resolve();
				});
			}catch(err){
				//global.socket.emit("error","Faile to write file "+file)	
				console.log("faild read file: ",file);
				reject(err);	
			}
		});
	},
	getFilesize:getFilesizeInBytes 
}