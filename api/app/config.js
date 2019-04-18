import config from 'config';
import dotenv from 'dotenv';
import envs from './constants/envs';
import env, { IS_TEST } from './utils/env';
import { errLog } from './utils/logs/logger';

if(!IS_TEST){
	dotenv.config();
}

if(!envs[env]){
	 errLog.error(`unknown env '${env}'`);
	 throw Error(`unknown env '${env}'`);
}

const PORT = process.env.PORT || config.get('port');
const MONGO_URI = process.env.MONGO_URI || config.get('mongo.uri');
const JWT_SECRET = config.get('jwt.secret');
const LOGIN = config.get('paycom.login');
const PW = config.get('paycom.pw');

if(!JWT_SECRET){
	errLog.error(`You must pass jwt secret string`);
	throw Error(`You must pass jwt secret string`);
}

export {
	PORT,	
	MONGO_URI,
	JWT_SECRET,
	LOGIN, PW
};

