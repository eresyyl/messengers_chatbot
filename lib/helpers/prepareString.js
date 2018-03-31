const cutString = require('./cutString.js'),
	removeHtml = require('./removeHtml.js'),	
	Entities = require('html-entities').XmlEntities,
	entities = new Entities();

module.exports = (string, length = 80) => {
	return cutString(removeHtml(entities.decode(string)), length);
}