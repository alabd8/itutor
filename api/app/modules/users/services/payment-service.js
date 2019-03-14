import { Payment } from '../models';

export default {
	async createPayment(data){
		try{
			return Payment.create(data);
		}catch(ex){
			throw new AppError({ status: 400, ...ex });
		}
	},
	async updatePayment(data, Payment) {
		Payment.set(data);

		try {
			return Payment.save();
		} catch (e) {
			throw new AppError({ status: 400, ...e });
		}
	},
	async find(){
		return Payment.find().select({ createdAt: 0, password: 0, _id: 0, __v: 0 });
	},
	async findOne(params){
		return Payment.findOne(params).select({ createdAt: 0, password: 0, _id: 0, __v: 0 });
	},
	async count(){
		return Payment.count();
	},
	async countOne(params){
		return Payment.find(params).count().select({ createdAt: 0, password: 0, _id: 0, __v: 0, });
	},
	async getRecommended(params){
		return Payment.find(params).select({ createdAt: 0, updatedAt: 0, password: 0, _id: 0, __v: 0 });
	},
	async getPaymentWithPublicFields(params){
		return Payment.findOne(params).select({ password: 0, createdAt: 0, updatedAt: 0, __v: 0, _id: 0 });
	},
	async getPaymentTitleWithPublicFields(){
		return Payment.find().sort({ title: -1 }).select({ createdAt: 0, updatedAt: 0, password: 0, _id: 0,  __v: 0 });
	},
};
