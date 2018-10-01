import { LC } from '../models';

export default {
	async createLC(data){
		try{
			return LC.create(data);
		}catch(ex){
			throw new AppError({ status: 400, ...ex });
		}
	},

	async getRecommended(params){
		console.log("SERVICE: ", params);
		return LC.find(params).select({ password: 0, updatedAt: 0, __v: 0 });
	},

	async getLCWithPublicFields(){
		return LC.find().sort({ title: -1 }).select({ password: 0, createdAt: 0, updatedAt: 0, __v: 0 });
	},

	async findOne(params){
		return LC.findOne(params).select({ password: 0, createdAt: 0, __v: 0 });
	},

	async find(){
		return LC.find().select({ password: 0, createdAt: 0, __v: 0 });
	},

	async countLC(params){
		return LC.find(params).count().select({ password: 0, createdAt: 0, __v: 0 });
	},

	async updateLC(data, lc){
		lc.set(data);

		try{
			return lc.save();
		}catch(ex){
			throw new AppError({ status: 400, ...ex });
		}
	},

};
