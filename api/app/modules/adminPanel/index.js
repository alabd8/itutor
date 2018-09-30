import Router from 'koa-router';
import accesUser from '../../handlers/accesUser';
import checkUser from '../../handlers/checkUser';
import checkAdmin from './handlers/checkAdmin';

const router = new Router({ prefix: '/admin' });

	router
		.get('/', accesUser(), checkAdmin())
		.param('hash', checkAdmin())
		.post('/', checkUser(), adminController.smth);
