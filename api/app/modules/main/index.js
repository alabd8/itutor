import Router from 'koa-router';
import mainController from './controllers/main-controller';
import checkUser from '../../handlers/checkUser';
import check from './handlers/check';
import checkID from './handlers/checkID';

const router = new Router();

router
	// .param('id', checkID())
	// .get('/', checkUser())
	.post('/', mainController.main)
	// .get('/select', checkUser())
	.post('/select', mainController.selected)
	// .post('/res/:id', checkUser(), mainController.res)
	// .get('/search', checkUser())
	.post('/search', mainController.search)
	// .get('/search/map', checkUser())
	.post('/search/map', mainController.searchMap)
	.post('/menu', mainController.menu);
	// .get('/menu', checkUser());

export default router.routes();

export {
	check
};