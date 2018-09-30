import mongoose from 'mongoose';

mongoose.Promise = Promise;

export default (mongo_uri) => {
	if(!mongo_uri){
		throw Error(`Mongo uri is undefined`);
	}

	return mongoose
		.connect(mongo_uri, { useNewUrlParser: true })
		.then((mongodb) => {
			console.log("Mongo connected");
			return mongodb;
		});
};