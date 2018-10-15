import Router from 'koa-router';
import mainController from './controllers/main-controller';
import checkUser from '../../handlers/checkUser';
import check from './handlers/check';
import checkID from './handlers/checkID';

const router = new Router();

router
	.post('/home', mainController.main)
	.post('/home/select', mainController.selected)
	.post('/home/results', mainController.search)
	.post('/search', mainController.main)
	.post('/menu', mainController.menu);

export default router.routes();

export {
	check
};