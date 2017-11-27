/**
* @str2json
*/
module.exports.convert = function(str){
	str = str.replace(/\\/g, '');
	try{
		console.log(str);
		str = JSON.parse(str);
	}catch(err){
		console.error("Error al convertir a Json: ",str);
	}
}