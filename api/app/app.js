import Koa from 'koa';
import cors from '@koa/cors';
import connectorsInit from './connectors';
import initHandlers from './handlers';
import modules from './modules';
import AppError from './helpers/appError';


connectorsInit();
global.AppError = AppError;

const app = new Koa();	

app.use(cors());

initHandlers(app);

app.use(modules);

app.use(async (ctx) => {
	ctx.body = '<h1>Hello Alisher</h1>';		
});

export default app;