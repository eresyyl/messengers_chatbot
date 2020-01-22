const template = require('../helpers/getMessageTemplate.js'),
	prepareString = require('../helpers/prepareString.js'),	
	Parser = require('rss-parser'),
	parser = new Parser();

const fbnewsController = {};

fbnewsController.list = async (ctx, next) => {
	let response = {};
	try{
		const feedURL = 'http://appreneur.com.au/category/messenger-news/feed/', 
			image_regexp =  /<img.*?src=["'](.*?)["']/,
			default_image_url = "https://appreneur.com.au/wp-content/uploads/2018/03/messenger_news-297x300.png"; 
		let feed = await parser.parseURL(feedURL);
		 
		const messages = [{
			type: "cards",
			elements: []			
		}];
		feed.items.forEach(item => {
			const image_url = image_regexp.exec(item['content:encoded']) ? image_regexp.exec(item['content:encoded'])[1] : default_image_url; 
			
			let element = {
				title: prepareString(item.title, 45),
				subtitle: prepareString(item.content, 80),
				image_url: image_url,
				buttons: [
					{
						type: "url",
						caption: "Read",
						url: item.link
					}/*,
					{
						"type": "share"
					}*/
				]
			}
			messages[0].elements.push(element);
		});
		template.content.messages = messages;
		response = template;
	}
	catch(err){
		response.error = err.errmsg;
		response.code = 400;	
	}

    ctx.body = response;
	ctx.code = response.code ? response.code : '';
	
    await next();
}


module.exports = fbnewsController;