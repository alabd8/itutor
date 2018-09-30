import Router from 'koa-router';
import tutorController from './controllers/tutor-controller';
import checkUser from '../../handlers/checkUser';
import accesUser from '../../handlers/accesUser';
import check from '../auth/handlers/check';
import { Tutor } from './models';


const router = new Router();

router
	.get('/signup', accesUser())
	.param('hash', check())
	.get('/signup/tu', accesUser())
	.post('/signup/tu', tutorController.signup);

export default router.routes();

export {
	Tutor,
};