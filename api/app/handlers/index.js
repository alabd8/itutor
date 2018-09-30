import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import logger from 'koa-logger';
import error from './error';
import jwt from './jwt';
import { IS_DEV } from '../utils/env';

export default (app) => {
	if(IS_DEV){
		app.use(logger());
	}


	app.use(error());
	app.use(require('koa-body')({
	    formidable:{
	        uploadDir: __dirname + '../../../images', // directory where files will be uploaded
	        keepExtensions: true // keep file extension on upload
	    },
	    multipart: true,
	    urlencoded: true,
	}));
	app.use(serve('../../images'));
	app.use(bodyParser());
	app.use(jwt());
}
