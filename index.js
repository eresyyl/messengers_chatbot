const Koa = require('koa'),
	app = new Koa(),
	mongoose = require('mongoose'),
	{routes, allowedMethods} = require('./lib/routes'),
	mongoConnectionString = require('./config/mongo.json').connection_string,
	port = require('./config/general.json').server_port || 8888;

mongoose.Promise = global.Promise;
	
mongoose.connect(mongoConnectionString);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Mongoose is on!');
});
	
app.use(routes());
app.use(allowedMethods());

app.listen(port, async() => {
	console.log(`Listening on port: ${port}`);
});