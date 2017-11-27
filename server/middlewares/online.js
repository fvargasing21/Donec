const ElectronOnline = require('electron-online')
const connection = new ElectronOnline();
module.exports = function(req,res,next){

	if(connection.status=='OFFLINE'){
		res.send(JSON.stringify({
			success:false,
			msg:"No hay conexión a internet."
		}));
	}else{
		next();
	}
}