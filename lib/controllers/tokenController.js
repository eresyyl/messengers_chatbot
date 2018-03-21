const
	mongoose = require('mongoose'),
	jwt = require("jsonwebtoken"),
	{jwt_secret} = require("../../config/security.json");

const tokenController = {};

tokenController.get = async (ctx, next) => {
	const response = {};
	try{		
		response.token = await jwt.sign({'foo': 'bar'}, jwt_secret);
		response.code = 201;
	}
	catch(err){
		response.error = err.errmsg;
		response.code = 400;	
	}
	
    ctx.body = response;
	ctx.code = response.code;
	
    await next();
}

module.exports = tokenController;