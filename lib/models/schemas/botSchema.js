const mongoose = require('mongoose');

const botsSchema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
    description: {
		type: String
	},
	image_url: {
		type: String,
		required: true
	},
	category: {
		type: String
	},
	more_link: {
		type: String
	},
	bot_link: {
		type: String
	},
	basic_rate: {
		type: Number
	},
	rate: {
		type: Array
	},
	reviews: {
		type: Array
	}
});

module.exports = botsSchema;