const mongoose = require('mongoose');

let botsSchema = mongoose.Schema({
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
	reviews: {
		type: Array
	}
});

botsSchema.methods.updateReview = function(new_review){
	let is_new = true;
	this.reviews.every( (review, i) => {
		if(review.user_id ==  new_review.user_id){
			this.reviews[i] = new_review;
			is_new = false;
			return false;
		}
		return true;
	});
	
	if(is_new) this.reviews.push(new_review);				
	this.calculateAvarageRate();
	
	return this;
}

botsSchema.methods.calculateAvarageRate = function(){
	let total_rate = 0;
	this.reviews.forEach( (review) => {
		total_rate += parseInt(review.rate);
	});
	
	this.avarage_rate = Math.round(total_rate / this.reviews.length, 2 );
	return this;
}

module.exports = botsSchema;