const mongoose = require('mongoose');

let reviewSchema = mongoose.Schema({
	text: {
		type: String,
		required: true,
		trim: true
	},
	user_id: {
		type: Number,
		required: true
	},
    rate: {
		type: Number,
		min: 0,
		max: 5
	},
	user_name: {
		type: String,
		trim: true
	},
	date: {
		type: Date
	}
});

module.exports = reviewSchema;