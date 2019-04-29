import Koa from 'koa';
import connectorsInit from './connectors';
import initHandlers from './handlers';
import modules from './modules';
import AppError from './helpers/appError';

connectorsInit();
global.AppError = AppError;

const app = new Koa();	

initHandlers(app);

app.use(modules);

app.use(async (ctx) => {
    ctx.status = 200;
    ctx.body = { message: 'Page not found' };
});

export default app;