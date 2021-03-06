const mongoose = require('mongoose'),
	flows = require('../../config/flows.json'),
	reviews_count = require('../../config/general.json').reviews_count || 10,
	Bots = require('../models/Bots.js'),	
	prepareString = require('../helpers/prepareString.js'),
	getStarRating = require('../helpers/getStarRating.js'),
	template = require('../helpers/getMessageTemplate.js');

const botsController = {};

botsController.list = async (ctx, next) => {
	let response = {},
		limit = parseInt(ctx.query.limit) || 10;
	const {offset, order} = ctx.query;
	try{
		const bot_fields = 'name description image_url bot_link';
		let bots = await Bots.getSponsored(bot_fields, ctx.query);
		
		limit = limit - bots.length;
		if( limit > 0 ){
			const other_bots = await Bots.find(
				{ is_sponsored: {$ne: true} }, 
				bot_fields, 
				{
					skip: offset ? parseInt(offset) : 0, // Starting Row
					limit: limit, // Ending Row
					sort:{
						_id: order ? parseInt(order) : -1 //Sort by _id Added DESC
					}
				}
			);
			
			bots = bots.concat(other_bots);
		}
		
		const messages = [{
			type: "cards",
			elements: []			
		}];
		let i = 1;
		bots.forEach((bot) => {
			let element = {
				title: prepareString(bot.name, 45),
				subtitle: prepareString(bot.description, 80),
				image_url: bot.image_url,
				buttons: [
					{
						type: "url",
						caption: "Chat with me",
						url: bot.bot_link
					}/*,{
						type: "share"
					}*/,{
						type: "flow",
						caption: "Rates And Reviews",
						target: flows.rates_and_reviews[i]
					}
				]
			}
			messages[0].elements.push(element);
			i++;
		});
		template.content.messages = messages;
		template.content.actions = [];
		
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

botsController.getByOrder = async (ctx, next) => {
	let response = {};
	
	try{
		const bot = await Bots.getBotByOrder(ctx.params.number - 1);		
		
		const messages = [{
			type: "cards",
			elements: [],			
		}];
		
		let element = {
			title: prepareString(bot.name, 45),
			subtitle: prepareString(bot.description, 80),
			image_url: bot.image_url,
			buttons: [
				{
					type: "url",
					caption: "Read More",
					url: bot.more_link
				},{
					type: "flow",
					caption: "Read Reviews",
					target: flows.read_reviews
				},{
					type: "flow",
					caption: "Leave Review",
					target: flows.leave_review
				}				
			]
		};
		messages[0].elements.push(element);
		template.content.messages = messages;
		template.content.actions = [{
			action: "set_field_value",
			field_name: "post_id",
			value: bot.post_id.toString()
		}];
		response = template;
	}
	catch(err){
		response.error = err;
		response.code = 400;	
	}
	ctx.body = response;
    if(response.code) ctx.status = response.code;
	
    await next();
}

botsController.getReviews = async (ctx, next) => {
	let response = {};
	
	try{
		const bot = await Bots.findOne(
			{ post_id: ctx.params.post_id }, 
			'post_id name reviews average_rate'
		);
		const messages = [];
		if( bot.reviews.length == 0 ) messages.push({
			type: "text",
			text: "There is no reviews on this bot"
		});
		else {
			let average_rate = getStarRating(bot.average_rate);
			messages.push({
				type: "text",
				text: `Average rating for "${bot.name}":\n${average_rate}`
			});
			let i = 0;
			bot.reviews.forEach( (review) => {
				let star_rating = getStarRating(review.rate);
				let review_text = `${review.user_name}\n`;
				review_text += `${star_rating}\n\n`;
				review_text += `${review.text}`;
				
				let message = {
					type: "text",
					text: prepareString(review_text, 640)			
				};
				
				messages.push(message);
				i++;
				return i <= reviews_count;
			});
		}
		template.content.messages = messages;
		template.content.actions = [];
		
		response = template;
	}
	catch(err){
		response.error = err;
		response.code = 400;	
	}
	ctx.body = response;
    if(response.code) ctx.status = response.code;
	
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
		const bot = await Bots.findOne({ post_id: ctx.params.post_id });
		
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
	let response = {};
	
	try{
		const {body} = ctx.request;
		let bot = await Bots.findOne({ post_id: body.post_id });
		if( bot ) {
			for(let i in body){				
				if( i != "reviews") bot[i] = body[i];
				else await bot.updateReview(body[i]);	
			};
		}
		else bot = new Bots(body);
		
		await bot.save();
		
		if(body.is_bot){
			template.content.messages = [{
				type: "text",
				text: "Thanks for the review!"
			}];
			template.content.actions = [];
			
			response = template;
		}
		else{
			response.message = bot;
			response.code = 201;
		}		
	}
	catch(err){
		response.error = err;
		response.code = 400;	
	}
	ctx.body = response;
    if(response.code) ctx.status = response.code;
	
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