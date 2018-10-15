import Router from 'koa-router';
import authController from './controllers/auth-controller';
import checkUser from '../../handlers/checkUser';
import accessUser from '../../handlers/accessUser';

const router = new Router();

router
	.get('/signup', accessUser())
	.get('/signup/us', accessUser())
	.post('/signup/us', authController.signup)
	.get('/login', accessUser())
	.post('/login', authController.login)
	.get('/profile/', checkUser(), authController.currentUser);

export default router.routes();
