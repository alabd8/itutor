import Router from 'koa-router';
import mainController from './controllers/main-controller';
import checkUser from '../../handlers/checkUser';
import checkAuth from './handlers/checkAuth';
import check from './handlers/check';

const router = new Router();

router
	.param('hash', check())
	.post('/', checkAuth(), mainController.main)
	.post('/home', mainController.home)
	.post('/home/select', mainController.selected)
	.post('/home/results', mainController.search)
	.post('/search', mainController.home)
	.post('/menu', mainController.menu)
	.post('/aliveoprstate/checkTrack', mainController.check);

export default router.routes();
