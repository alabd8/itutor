import Router from 'koa-router';
import auth from './auth';
import main from './main';
import lc from './lcs';
import tutor from './tutors';
import token from './tokens';
import admin from './admin';
import moderator from './moderators';

const router = new Router();

router.use(auth);
router.use(main);
router.use(lc);
router.use(tutor);
router.use(token);
router.use(admin);
router.use(moderator);

export default router.routes();