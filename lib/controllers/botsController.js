const mongoose = require('mongoose'),
	Bots = require('../models/Bots.js'),
	template = require('../helpers/getMessageTemplate.js'),	
	prepareString = require('../helpers/prepareString.js');

const botsController = {};

botsController.list = async (ctx, next) => {
	let response = {};
	const {offset, limit, order} = ctx.query;
	try{
		const bots = await Bots.find(
			{}, 
			'name description image_url more_link bot_link', 
			{
				skip: offset ? parseInt(offset) : 0, // Starting Row
				limit: limit ? parseInt(limit) : 10, // Ending Row
				sort:{
					_id: order ? parseInt(order) : -1 //Sort by _id Added DESC
				}
			}
		);
		const messages = [{
			type: "cards",
			elements: []			
		}];
		bots.forEach((bot) => {
			let element = {
				title: prepareString(bot.name, 45),
				subtitle: prepareString(bot.description, 80),
				image_url: bot.image_url,
				buttons: [
					{
						type: "url",
						caption: "More",
						url: bot.more_link
					},{
						type: "url",
						caption: "Chat with me",
						url: bot.bot_link
					},{
						type: "share"
					}/*,{
						type: "flow",
						caption: "Go",
						target: "content20180406064110_414845"
					}*/
				]
			}
			messages[0].elements.push(element);
		});
		template.content.messages = messages;
		response = template;
		//response.code = 201;
	}
	catch(err){
		response.error = err.errmsg;
		response.code = 400;	
	}
	
    ctx.body = response;
	ctx.code = response.code ? response.code : '';
	
    await next();
}

botsController.create = async (ctx, next) => {
	const response = {};
	try{
		const {body} = ctx.request;
		let bot = new Bots(body);
		
		await bot.save();	
			
		response.message = bot;
		response.code = 201;	
	}
	catch(err){
		response.error = err.errmsg;
		response.code = 400;	
	}
	ctx.body = response;
	ctx.status = response.code;
	
    await next();
}

botsController.check = async (ctx, next) => {
	const response = {};
	try{
		let bot = await Bots.findOne({ post_id: ctx.params.post_id });
		
		response.message = bot ? true : false;
		response.code = 201;	
	}
	catch(err){
		response.error = err;
		response.code = 400;	
	}
	ctx.body = response;
    ctx.status = response.code;
	
    await next();
}

botsController.update = async (ctx, next) => {
	const response = {};
	try{
		const {body} = ctx.request;
		let bot = await Bots.findOne({ post_id: body.post_id });
		if( bot ) {
			for(let i in body){
				bot[i] = body[i];
			};
		}
		else bot = new Bots(body);
		
		await bot.save();
		
		response.message = bot;
		response.code = 201;	
	}
	catch(err){
		response.error = err;
		response.code = 400;	
	}
	ctx.body = response;
    ctx.status = response.code;
	
    await next();
}

botsController.remove = async (ctx, next) => {
	const response = {};
	try{
		let bot = await Bots.findOne({ post_id: ctx.params.post_id });
		await bot.remove();
		
		response.message = 'OK';
		response.code = 201;	
	}
	catch(err){
		response.error = err;
		response.code = 400;	
	}
	ctx.body = response;
    ctx.status = response.code;
	
    await next();
}

module.exports = botsController;