const remote = require("electron").remote;
const main = remote.require('./main.js');
var path = require("path");
var Helper = remote.require("./server/helpers/helper.js");
var Constants = remote.require("./server/helpers/Constants.js");

global.BASE_PATH = Constants.URL_BASE;
global.APP_PATH = main.directory;

var app_config = path.join(global.APP_PATH,'server','app.json');
//Esta funcion incializa el proceso de renderización del Cliente, se utiliza en: /public/app/index.html
function __init(){

	global.instaled = true;		
	//Conectarse al Socket que controla el proceso del Cliente.
	let socket = io.connect(global.BASE_PATH,{'forceNew':true});
	//#Variable Global para uso del Lado Cliente que administra la comunicación con el Serividor Socket.
    global.socket = socket;
	socket.on("start",function(config){
	    console.log("Socket started",config);
	    if(!("user" in config)){
	    	console.info("Sesión reiniciada.");
			localStorage.clear();
	    }
	});
	
	socket.on("message",function(msg){
		try{
			Msg.info(msg);
		}catch(err){
			console.info(msg)
		}
	});
	
	var sync;
	socket.on('online', (msg,status) => {
		sync = global.sync || false;
		
		console.log(msg);
		console.log("sync: ",sync);
		socket.emit("onsync",sync);
		
	  	try{
		  	Msg.info('Donec is online!')
		  }catch(err){
		  	console.info('Donec is online!')
		  }
	});
	socket.on('offline', (msg,status) => {
		sync = global.sync || false;
		console.log("sync: ",sync);
		socket.emit("onsync",sync);
		try{
			Msg.info('Donec is offline!')
		}catch(err){
			console.info('Donec is offline!')
		}
	});
	socket.on('sync', (msg,status) => {
		try{
			Msg.info(msg);
		}catch(err){
			console.info(msg)
		}
	});
	console.log("Donec",global.instaled);
}
 __init();