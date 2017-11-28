'use strict'

const jwt = require("jwt-simple");
const moment = require("moment");
const session = require("express-session");
function createToken(user,secret){
	const payload = {
		"sub":user._id,
		"iat":moment.unix(),
		"exp":moment.add(14,'days').unix()
	}
	console.log("secret: ",secret,session.secret);
	return jwt.encode(payload,secret);
}

module.exports = createToken;