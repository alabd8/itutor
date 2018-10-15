import Router from 'koa-router';
import lcController from './controllers/lc-controller';
import checkUser from '../../handlers/checkUser';
import accessUser from './handlers/accessUser';
import checkLC from './handlers/checkLC';
import checkID from './handlers/checkID';
import { LC } from './models';


const router = new Router();

router
	.get('/signup', accessUser())
	.post('/signup/lc/verify', lcController.verify)
	.post('/signup/lc', lcController.signup)
	.param('hash', checkLC())
	.param('id', checkID())
	.post('/menu/courses/:hash', accessUser(), lcController.courses)
	.put('/menu/courses/:hash', accessUser(), lcController.update)
	.post('/menu/courses/:hash/new-course', accessUser(), lcController.create)
	.delete('/menu/courses/:hash/:id', accessUser(), lcController.delete)

	.post('/centers/:hash/courses', lcController.showCourses)
	.post('/centers/:hash/courses/:id', lcController.showCourse)
	.post('/centers/:hash/teachers', lcController.teachers)
	.post('/centers/:hash/teachers/:id', lcController.teacher)
	.post('/centers/:hash/gallery', lcController.gallery);


export default router.routes();

export {
	LC,
};
	