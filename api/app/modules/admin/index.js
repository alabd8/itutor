import Router from 'koa-router';
import adminController from './controllers/admin-controller';
import checkAdmin from './handlers/checkAdmin';

const router = new Router({ prefix: '/admin' });

	router
		.post('/administrators', checkAdmin(), adminController.getAdministrators)
		.post('/create/moderator', checkAdmin(), adminController.createModerator)
		.post('/center', checkAdmin(), adminController.genKeyForCenter)
		.post('/getusers', checkAdmin(), adminController.defineUser);

export default router.routes();