import { MONGO_URI } from '../config';
import mongooseConnector from './mongoose-connector';
import server from '../server';
import { errLog } from '../utils/logs/logger';

async function connectorsInit(){
	try{
		await mongooseConnector(MONGO_URI);
	}catch(e){
		errLog.error('ConnectorsInit Error: ', e);
		server.close();
	}
};

export {
	mongooseConnector
};

export default connectorsInit;