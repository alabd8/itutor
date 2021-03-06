import Router from 'koa-router';
import tutorController from './controllers/tutor-controller';
import checkUser from '../../handlers/checkUser';
import checkID from './handlers/checkID';
import checkTutor from './handlers/checkTutor';


const router = new Router();

router
	.param('hash', checkTutor())
	.param('id', checkID())
	.post('/menu/teachers/:hash', checkUser(), tutorController.getTutor)
	.put('/menu/teachers/:hash/:id', checkUser(), tutorController.update)
	.post('/menu/teachers/:hash/new-course', checkUser(), tutorController.create)
	.delete('/menu/teachers/:hash/:id', checkUser(), tutorController.delete)
	.put('/menu/:hash/contacts', checkUser(), tutorController.updateTutor)
	.put('/menu/:hash/settings', checkUser(), tutorController.updateTutor)

	.post('/tutors/:hash/courses', tutorController.showCourses)
	.post('/tutors/:hash/courses/:id', tutorController.showCourse)
	.post('/tutors/:hash/gallery', tutorController.gallery)

	.delete('/tutor/:hash', checkUser(), tutorController.deleteTutor);
	

export default router.routes();