import Router from 'koa-router';
import moderatorController from './controllers/moderator-controller';
import checkUser from '../../handlers/checkUser';

const router = new Router({ prefix: '/moderator' });

router
    .post('/menu', checkUser(), moderatorController.getUser)
    .post('/requested/centers', checkUser(), moderatorController.requestedCenters)
    .post('/centers', checkUser(), moderatorController.centers);
    
export default router.routes();