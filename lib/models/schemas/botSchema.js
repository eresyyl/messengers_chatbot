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
	avarage_rate: {
		type: Number,
		min: 0,
		max: 5
	},
	reviews: [reviewSchema]
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
	
	this.avarage_rate = Math.round(total_rate / this.reviews.length, 2 );
	return this;
}

module.exports = botSchema;