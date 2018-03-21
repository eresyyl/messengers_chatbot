const mongoose = require('mongoose');
const botSchema = require('./schemas/botSchema.js');

const Bots = mongoose.model('Bots', botSchema);

module.exports = Bots;