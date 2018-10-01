import Router from 'koa-router';
import mainController from './controllers/main-controller';
import checkUser from '../../handlers/checkUser';
import check from './handlers/check';
import checkID from './handlers/checkID';

const router = new Router();

router
	.post('/', mainController.main)
	.post('/select', mainController.selected)
	.post('/search', mainController.search)
	.post('/search/map', mainController.searchMap)
	.post('/menu', mainController.menu);

export default router.routes();

export {
	check
};