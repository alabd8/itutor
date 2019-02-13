import Router from 'koa-router';
import mainController from './controllers/main-controller';

const router = new Router();

router
	.post('/', mainController.main)
	.post('/home', mainController.home)
	.post('/home/select', mainController.selected)
	.post('/home/results', mainController.search)
	.post('/search', mainController.home)
	.post('/menu', mainController.menu)
	.post('/aliveoprstate/checkTrack', mainController.check);

export default router.routes();
