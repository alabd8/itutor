import Router from 'koa-router';
import lcController from './controllers/lc-controller';
import checkUser from '../../handlers/checkUser';
import accesUser from '../../handlers/accesUser';
import checkLC from './handlers/checkLC';
import checkID from './handlers/checkID';
import { LC } from './models';


const router = new Router();

router
	.get('/signup', accesUser())
	.post('/signup/lc/verify', lcController.verify)
	.post('/signup/lc', lcController.signup)
	.param('hash', checkLC())
	.param('id', checkID())
	.post('/lc/:hash', checkUser(), lcController.lc)
	.post('/lc/:hash/courses/cotegory', checkUser(), lcController.cotegory)
	.post('lc/:hash/courses/select', checkUser(), lcController.select)
	.post('lc/:hash/courses/:id', checkUser(), lcController.courseList)
	.post('lc/:hash/teachers', checkUser(), lcController.teachers)
	.post('lc/:hash/teacher/:id', checkUser(), lcController.teacher)
	.put('lc/:hash', checkUser(), lcController.update)
	.delete('lc/:hash', checkUser(), lcController.delete)
	.get('/:hash', lcController.getLC);


export default router.routes();

export {
	LC,
};