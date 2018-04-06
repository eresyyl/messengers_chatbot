const Router = require('koa-router'),
	KoaBody = require('koa-body'),
	//jwt = require('koa-jwt'),
	//{jwt_secret} = require("../../config/security.json"),
	botsController = require('../controllers/botsController.js'),
	fbnewsController = require('../controllers/fbnewsController.js');

const router = new Router();

router
	//.get('/token/', tokenController.get).
	.get('/bots/', botsController.list)
	.get('/bots/byOrder/:number', botsController.getByOrder)
	.post('/bots/', KoaBody(), botsController.create)
	.get('/bots/:post_id', botsController.check)
	.put('/bots/', KoaBody(), botsController.update)
	.delete('/bots/:post_id', botsController.remove)
	.get('/fbnews/', fbnewsController.list)
	;

/*router
	.use(['/orders/:id', '/orders/confirm/'], jwt({ secret: jwt_secret }));	*/
	
module.exports = {
    routes () { return router.routes() },
    allowedMethods () { return router.allowedMethods() }
};