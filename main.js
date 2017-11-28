const electron = require("electron");
const {app, BrowserWindow, dialog} = electron;
const path = require("path");
const url = require("url");
const isDev = () => process.env.NODE_ENV === 'development';
process.env['APP_PATH'] = app.getAppPath();
const directory = isDev()?process.cwd().concat('/app'):process.env.APP_PATH;

const ElectronOnline = require('electron-online')
const connection = new ElectronOnline();

var server = require('./server/app');
var Constants = require("./server/helpers/Constants.js");
var Helper = require("./server/helpers/helper");
global.APP_PATH = app.getAppPath();
var app_config = path.join(global.APP_PATH,'public','config','app.json');

let win
let ready = false;

function createWindow(options,callback){

	options = options || {};
	var config = {
		icon:path.join(directory,'assests','icon.png'),
		width:options.width || 1366,
		height:options.height || 768
	};
	for(var key in options){
		if(!(key in config)){
			config[key] = options[key];
		}
	}
	win = new BrowserWindow(config);

	/*win.loadURL(url.format({
		pathname:path.join(directory,options.url),
		protocol:'file',
		slashes:true
	}));*/
	win.loadURL(Constants.URL_BASE+(options.url || ''));
	
	//Open devtools
	win.webContents.openDevTools();

	win.on("closed",()=>{
		win = null;
		app.quit();
	})
	const ses = win.webContents.session;

	win.once('ready-to-show', () => {
	 	win.show();
	});

	if(callback!=undefined){
		callback(win);
	}
	return win;
}

app.on("ready",function(){

	server({})
	.then(function(){
		createWindow({url:'public/js/index.html#paciente'},function(win){
		  	ready=true;
	  	});
	});
	connection.on('online', () => {
	  console.log('App is online!')
	})
	connection.on('offline', () => {
	  	console.log('App is offline!');
	  	if(!ready){
		  	createWindow({url:'public/js/index.html#offline'});
		}
	});
});
app.on("window-all-closed",()=>{
	if(process.platform !== 'drawin'){
		app.quit()
	}
})
app.on("active",()=>{
	if(win===null){
		//createWindow()
	}
})
exports.directory = directory;
const Msg = (config) => {
	dialog.showMessageBox(win,config);
};
exports.Msg = Msg;
