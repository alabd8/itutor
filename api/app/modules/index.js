import Router from 'koa-router';
import auth from './auth';
import main from './main';
import lc from './lcs';
import tutor from './tutors';
import token from './tokens';
// import admin from './adminPanel';

const router = new Router();

router.use(auth);
router.use(main);
router.use(lc);
router.use(tutor);
router.use(token);
// router.use(admin);

export default router.routes();