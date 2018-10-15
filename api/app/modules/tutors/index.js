import Router from 'koa-router';
import tutorController from './controllers/tutor-controller';
import checkUser from '../../handlers/checkUser';
import accessUser from '../../handlers/accessUser';
import check from './handlers/check';
import { Tutor } from './models';


const router = new Router();

router
	.get('/signup', accessUser())
	.param('hash', check())
	.get('/signup/tu', accessUser())
	.post('/signup/tu', tutorController.signup)
	.post('/tutor/:hash', tutorController.getTutor)
	.put('/tutor/:hash', checkUser(), tutorController.update)
	.delete('/tutor/:hash', checkUser(), tutorController.delete);

export default router.routes();

export {
	Tutor,
};