import mongoose from 'mongoose';
import { debLog, errLog } from '../utils/logs/logger';

mongoose.Promise = Promise;

export default (mongo_uri) => {
	if(!mongo_uri){
		errLog.error(`Mongo uri is undefined`);
	}

	return mongoose
		.connect(mongo_uri, { useNewUrlParser: true })
		.then((mongodb) => {
			console.log('Mongo connected');
			debLog.debug(`Mongo connected`, mongodb);
			return mongodb;
		});
};