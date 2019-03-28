import Router from 'koa-router';
import mainController from './controllers/main-controller';
import checkAuth from './handlers/checkAuth';

const router = new Router();

router
	.post('/', checkAuth(), mainController.main)
	.post('/home', mainController.home)
	.post('/home/select', mainController.selected)
	.post('/home/results', mainController.search)
	.post('/search', mainController.home)
	.post('/menu', mainController.menu)
	.post('/aliveoprstate/checkTrack', mainController.check);

export default router.routes();
