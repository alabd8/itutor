import Router from 'koa-router';
import mainController from './controllers/main-controller';
import checkUser from '../../handlers/checkUser';
import check from './handlers/check';
import checkID from './handlers/checkID';

const router = new Router();

router
	// .param('id', checkID())
	.post('/', checkUser(), mainController.main)
	.post('/select', checkUser(), mainController.selected)
	// .post('/res/:id', checkUser(), mainController.res)
	.post('/search', checkUser(), mainController.search)
	.post('/search/map', checkUser(), mainController.searchMap)
	.get('/menu', checkUser(), mainController.menu);

export default router.routes();

export {
	check
};