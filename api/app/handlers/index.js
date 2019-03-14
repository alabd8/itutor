import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import serve from 'koa-static';
import logger from 'koa-logger';
import error from './error';
import jwt from './jwt';
import checkAmount from './checkAmount';
import { IS_DEV } from '../utils/env';

export default (app) => {
	if(IS_DEV){
		app.use(logger());
	}

	app.use(cors());
	app.use(error());
	app.use(require('koa-body')({
	    formidable:{
	        uploadDir: __dirname + '../../../images', // directory where files will be uploaded
	        keepExtensions: true // keep file extension on upload
	    },
	    multipart: true,
	    urlencoded: true
	}));
	app.use(serve('../../images'));
	app.use(bodyParser());
	app.use(jwt());
	app.use(checkAmount());
}
