const Router = require('koa-router'),
	KoaBody = require('koa-body'),
	//jwt = require('koa-jwt'),
	//{jwt_secret} = require("../../config/security.json"),
	botsController = require('../controllers/botsController.js');

const router = new Router();

router
	//.get('/token/', tokenController.get).
	.get('/bots/', botsController.list)
	.post('/bots/', KoaBody(), botsController.create)
	.get('/bots/:name', botsController.check)
	.put('/bots/', KoaBody(), botsController.update)
	.delete('/bots/:name', botsController.remove)
	;

/*router
	.use(['/orders/:id', '/orders/confirm/'], jwt({ secret: jwt_secret }));	*/
	
module.exports = {
    routes () { return router.routes() },
    allowedMethods () { return router.allowedMethods() }
};