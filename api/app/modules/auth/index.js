import Router from 'koa-router';
import authController from './controllers/auth-controller';
import checkUser from '../../handlers/checkUser';
import accessUser from '../../handlers/accessUser';
import check from './handlers/check';

const router = new Router();

router
	.post('/menu/auth/signup', authController.access)
	.post('/menu/auth/signup/student', accessUser(), authController.signup)
	.post('/menu/auth/signin', accessUser(), authController.login)
	.param('hash', check())
	.delete('/user/:hash', checkUser(), authController.deleteUser)
	.post('/user/:hash', checkUser(), authController.currentUser);

export default router.routes();
