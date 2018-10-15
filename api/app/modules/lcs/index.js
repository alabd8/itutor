import Router from 'koa-router';
import lcController from './controllers/lc-controller';
import checkUser from '../../handlers/checkUser';
import accessUser from '../../handlers/accessUser';
import checkLC from './handlers/checkLC';
import checkID from './handlers/checkID';
import { LC } from './models';


const router = new Router();

router
	.post('/signup/lc/verify', accessUser(), lcController.verify)
	.post('/menu/auth/signup/center', accessUser(), lcController.signup)
	.param('hash', checkLC())
	.param('id', checkID())
	.post('/menu/courses/:hash', checkUser(), lcController.courses)
	.put('/menu/courses/:hash/:id', checkUser(), lcController.update)
	.post('/menu/courses/:hash/new-course', checkUser(), lcController.create)
	.delete('/menu/courses/:hash/:id', checkUser(), lcController.delete)
	.put('/menu/contacts/:hash', checkUser(), lcController.updateLC)
	.put('/menu/settings/:hash', checkUser(), lcController.updateLC)

	.post('/centers/:hash/courses', lcController.showCourses)
	.post('/centers/:hash/courses/:id', lcController.showCourse)
	.post('/centers/:hash/teachers', lcController.teachers)
	.post('/centers/:hash/teachers/:id', lcController.teacher)
	.post('/centers/:hash/gallery', lcController.gallery);


export default router.routes();

export {
	LC,
};
	