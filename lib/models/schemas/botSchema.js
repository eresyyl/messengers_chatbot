const mongoose = require('mongoose');

const botsSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
		unique: true
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
	total_rate: {
		type: Number,
		min: 0,
		max: 5
	},
	rates: {
		type: Array
	},
	reviews: {
		type: Array
	}
});

module.exports = botsSchema;