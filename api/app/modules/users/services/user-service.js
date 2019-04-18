import { User } from '../models';

export default {
	async createUser(data){
		try{
			return User.create(data);
		}catch(ex){
			throw new AppError({ status: 400, ...ex });
		}
	},
	async updateUser(data, user){
		user.set(data);

		try {
			return user.save();
		} catch (e) {
			throw new AppError({ status: 400, ...e });
		}
	},
	async updateOne(id, data){
		return User.updateOne({ "page.course._id": id }, { $set: { "page.course.$": data } }, { upsert: true });
	},
	async pull(id, courseId){
		return User.findByIdAndUpdate(id, { $pull: { 'page.course': { 	_id: courseId } } }, { 'new': true });
	},
	async push(id, data){
		return User.findByIdAndUpdate(id, { $push: { 'page.course': data } }, { 'new': true });
	},
	async find(params){
		return User.find(params).select({ createdAt: 0, password: 0, _id: 0, __v: 0 });
	},
	async findOne(params){
		return User.findOne(params).select({ createdAt: 0, password: 0, __v: 0 });
	},
	async findOneAndUpdate(data, params){
		return User.findOneAndUpdate(data, { $set: params }, { new: true })
					.select({ createdAt: 0, __v: 0 });
	},
	async count(){
		return User.count();
	},
	async countOne(params){
		return User.find(params).count().select({ createdAt: 0, password: 0, _id: 0, __v: 0 });
	},
	async getRecommended(params){
		return User.find(params).select({ createdAt: 0, updatedAt: 0, password: 0, _id: 0, __v: 0 });
	},
	async getUserWithPublicFields(params){
		return User.findOne(params).select({ password: 0, createdAt: 0, updatedAt: 0, __v: 0, _id: 0 });
	},
	async getUserTitleWithPublicFields(){
		return User.find().sort({ title: -1 }).select({ createdAt: 0, updatedAt: 0, password: 0, _id: 0,  __v: 0 });
	}
};
