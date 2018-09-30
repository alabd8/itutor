import { MONGO_URI } from '../config';
import mongooseConnector from './mongoose-connector';
import server from '../server';


async function connectorsInit(){
	try{
		await mongooseConnector(MONGO_URI);
	}catch(ex){
		server.close();
		console.error(ex);
	}
};

export {
	mongooseConnector,
};

export default connectorsInit;