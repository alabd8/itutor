import { Tutor } from '../models';

export default {
	async createTutor(data){
		try{
			return Tutor.create(data);
		}catch(ex){
			throw new AppError({ status: 400, ...ex });
		}
	},

	async updateTutor(data, tutor){
		tutor.set(data);

		try{
			return tutor.save()
		}catch(ex){
			throw new AppError({ status: 400, ...ex });
		}
	},

	async pull(tutorId, courseId){
		return Tutor.findByIdAndUpdate(tutorId, { $pull: { 'course': { _id: courseId } } }, { 'new': true });
	},

	async push(tutorId, data){
		return Tutor.findByIdAndUpdate(tutorId, { $push: { 'course': data } }, { 'new': true });
	},
	
	async getRecommended(params){
		return Tutor.find(params).select({ __v: 0, createdAt: 0, password: 0, _id: 0 });
	},

	async getTutorWithPublicFields(){
		return Tutor.find().sort({ title: -1 }).select({ _id: 0, password: 0, createdAt: 0, __v: 0 });
	},

	async findOne(params){
		return Tutor.findOne(params).select({ _id: 0, password: 0, createdAt: 0, __v: 0 });
	},

	async countTutor(params){
		return Tutor.find(params).count().select({ _id: 0, password: 0, createdAt: 0, __v: 0 });
	},

	async find(){
		return Tutor.find().select({ password: 0, createdAt: 0, __v: 0, _id: 0 });
	},

	async count(){
		return Tutor.count();
	}
};