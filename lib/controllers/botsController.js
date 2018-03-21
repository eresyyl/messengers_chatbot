const mongoose = require('mongoose'),
	Bots = require('../models/Bots.js'),
	template = require('../helpers/getMessageTemplate.js');

const botsController = {};

botsController.list = async (ctx, next) => {
	let response = {};
	try{
		let bots = await Bots.find(
			{}, 
			'name description image_url more_link bot_link', 
			{
				skip:0, // Starting Row
				limit:10, // Ending Row
				sort:{
					_id: -1 //Sort by Date Added DESC
				}
			}
		);
		const messages = [{
			type: "cards",
			elements: []			
		}];
		bots.forEach((bot) => {
			let element = {
				title: bot.name,
				subtitle: bot.description,
				image_url: bot.image_url,
				buttons: [
					{
						type: "url",
						caption: "More",
						url: bot.more_link
					},
					{
						type: "url",
						caption: "Chat with me",
						url: bot.bot_link
					},
					{
						"type": "share"
					}
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

module.exports = botsController;