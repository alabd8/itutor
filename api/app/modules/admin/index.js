import Router from 'koa-router';
import adminController from './controllers/admin-controller';
import checkAdmin from './handlers/checkAdmin';
import { Admin } from './models';

const router = new Router({ prefix: '/admin' });

	router
		.post('/moderators', checkAdmin(), adminController.moderators);

export default router.routes();

export { 
	Admin,
}