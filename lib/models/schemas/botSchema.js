const mongoose = require('mongoose'),
	reviewSchema = require('./reviewSchema.js');

let botSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
	},
	post_id: {
		type: Number,
		unique: true,
		required: true
	},
    description: {
		type: String,
		trim: true
	},
	image_url: {
		type: String,
		trim: true,
		required: true
	},
	category: {
		type: Array
	},
	more_link: {
		type: String,
		trim: true
	},
	bot_link: {
		type: String,
		trim: true
	},
	basic_rate: {
		type: Number
	},
	average_rate: {
		type: Number,
		min: 0,
		max: 5
	},
	reviews: [reviewSchema],
	is_sponsored: {
		type: Boolean,
		default: false
	}
});

botSchema.methods.updateReview = async function(new_review){
	let is_new = true;
	new_review.date = new Date();
	this.reviews.every( (review, i) => {
		if(review.user_id ==  new_review.user_id){
			review.remove();
			return false;
		}
		return true;
	});
	
	this.reviews.push(new_review);				
	await this.calculateAvarageRate();
	
	return this;
}

botSchema.methods.calculateAvarageRate = async function(){
	let total_rate = 0;
	this.reviews.forEach( (review) => {
		total_rate += parseInt(review.rate);
	});
	
	this.average_rate = Math.round(total_rate / this.reviews.length, 2 );
	return this;
}

botSchema.statics.getSponsored = async function(fields, params = {}){
	const {limit, offset, order} = params;
	return await this.find(
		{ is_sponsored: true }, 
		fields, 
		{
			skip: offset ? parseInt(offset) : 0, // Starting Row
			limit: limit ? parseInt(limit) : 10, // Ending Row
			sort:{
				_id: order ? parseInt(order) : -1 //Sort by _id Added DESC
			}
		}
	);
}

botSchema.statics.getBotByOrder = async function(number){
	const bot_fields = 'post_id name description image_url more_link';
	const sponsored_bots = await this.getSponsored(bot_fields);
	
	if( sponsored_bots[number] ) return sponsored_bots[number];
	
	return await this.findOne(
		{ is_sponsored: {$ne: true} }, 
		bot_fields,
		{
			skip: number - sponsored_bots.length, // Starting Row
			limit: 1, // Ending Row
			sort:{
				_id:  -1 //Sort by _id Added DESC
			}
		}
	);
}

module.exports = botSchema;