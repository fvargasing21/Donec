const express =require('express');
var http = require("https");
var md5 = require("md5");
var fs = require("fs");
var path = require("path");
var url = require("url");
var pem = require('pem');
var cors = require('cors')
var moment = require('moment-timezone');

var bodyParser = require("body-parser");
var session = require("express-session");
var session_middleware = require("./middlewares/session");


var online = false;
var app = express();
var server = require("http").Server(app);
var io = require("socket.io")(server);
var events = require('events');//Events administra eventos
const mongoose = require("mongoose");
const ManagerDB = require("./database/ManagerDB");
mongoose.Promise = global.Promise;
var Helper = require("./helpers/helper.js");
var Constants = require("./helpers/Constants.js");
var request = require('request');
var formData = require('form-data');
var socket;
var db;
var initialized = false;
const corsOptions = {
	origin:Constants.URL_BASE
}
app.use(cors(corsOptions))

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', false);

    // Pass to next layer of middleware
    next();
});



app.get("/",function(req,res){
	
	//res.send(`<h2>Welcome to:<br>Donec API - Hard Code to support web desktop Applications.</h2><img src="public/resources/images/logo.png" style="width:250px;height:250px;" />`);
	res.sendFile(path.join(__dirname,'index.html'));
});

module.exports = function(config){

	var port = process.env.PORT || 3000;
	global.config = config;

	console.log("config: ",config);
	function init(){
		if(!initialized){
			io.on("connect",function(_socket){
				config["port"] = port;
				console.log("socket connected!!!!");
				global.socket = socket;
				
				socket = _socket;
				socket.on("error",function(err){
					socket.emit("message",err);
				});
				socket.emit("start",{
					"success":true,
					"user":global.user
				});
				const ElectronOnline = require('electron-online')
				const connection = new ElectronOnline();
				var online = (connection.status=='ONLINE');
				connection.on("online",function(msg){
					if(!online){
						console.log("Aplicación en linea.",connection.status);
						socket.emit("online","Aplicación en linea.",connection.status);
						online = true;
					}
				});
				connection.on("offline",function(msg){
					if(online){
						console.log("Aplicación sin conexión.",connection.status);
						socket.emit("offline","Aplicación sin conexión.",connection.status);
						online = false;
					}
				});
				socket.on("onsync",function(status){
					console.log("Sincronización atomática.",status);
					var msg = (status==true)?"Sincronización activada":"Sincronización desactivada.";
					socket.emit("sync",msg,status);
				});
				
			});
			
			console.log("Aplicación Iniciada.",new Date().toLocaleString());
			initialized =true;
		}
	}

	console.log("Iniciando Aplicación");
	return new Promise(function(resolve,reject){
		//Sockets
		
		//Middlewares
		app.use(bodyParser.json());//para peticiones aplication/json
		app.use(bodyParser.urlencoded({extended:true}));
		app.use(session({
			secret:"c20d8281f15f26ab809c4736ac1eda7b",
			resave:false,
			saveUninitialized:false
		}));
		//Crear Instancia de Objeto Administrador de base de datos
		db = ManagerDB.createManagerDB();

		app.use("/public",express.static(path.join(global.APP_PATH,"public")));
		app.use("/app",session_middleware);

		var routes = require("./routes");
		app.use("/app",routes(app,db,io));
		app.use(function(req, res, next) {
		  res.header("Access-Control-Allow-Origin", "*");
		  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		  next();
		});

		server.listen(port,function(){
			db.connect()
			.then(function(msg){
				//iniciar utilidades de aplicación
				init();
				console.log("Donec is ready http://localhost:"+port);
				resolve(config);
			},function(err){
				reject(err);
			});
		});
	});
}