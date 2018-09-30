import Router from 'koa-router';
import authController from './controllers/auth-controller';
import checkUser from '../../handlers/checkUser';
import accesUser from '../../handlers/accesUser';

const router = new Router();

router
	.get('/signup', accesUser())
	.get('/signup/us', accesUser())
	.post('/signup/us', authController.signup)
	.get('/login', accesUser())
	.post('/login', authController.login)
	.get('/profile/', checkUser(), authController.currentUser);

export default router.routes();
