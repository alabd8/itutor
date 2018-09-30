import { Tutor } from '../models';

export default {
	async createTutor(data){
		try{
			return Tutor.create(data);
		}catch(ex){
			throw new AppError({ status: 400, ...ex });
		}
	},

	async getRecommended(params){
		return Tutor.find(params).select({ __v: 0, createdAt: 0, password: 0 });
	},

	async getTutorWithPublicFields(){
		return Tutor.find().sort({ title: -1 }).select({ _id: 0, password: 0, createdAt: 0, __v: 0 });
	},

	async searchTutor(params){
		return Tutor.findOne(params).select({ _id: 0, password: 0, createdAt: 0, __v: 0, });
	},

	async countTutor(params){
		return Tutor.find(params).count().select({ _id: 0, password: 0, createdAt: 0, __v: 0, });
	},

	async find(){
		return Tutor.find().select({ password: 0, createdAt: 0, __v: 0 });
	},
};