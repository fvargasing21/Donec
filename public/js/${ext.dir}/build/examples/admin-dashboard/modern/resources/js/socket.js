var socket = io.connect("http://localhost:3000",{'forceNew':true});

socket.on('messages',function(data){
	console.log(data);
});
console.log("io ready!")