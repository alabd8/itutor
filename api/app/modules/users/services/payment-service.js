import { Payment } from '../models';

export default {
	async createPayment(data){
		try{
			return Payment.create(data);
		}catch(ex){
			throw new AppError({ status: 400, ...ex });
		}
	},
	async updatePayment(data, payment) {
		payment.set(data);
			
		try {
			return payment.save();
		} catch (e) {
			throw new AppError({ status: 400, ...e });
		}
	},
	async find(data){
		if(data) return Payment.find(data).select({ createdAt: 0, __v: 0, hash: 0 });
		
		return Payment.find().select({ createdAt: 0, __v: 0, hash: 0 });
	},
	async findOne(params){
		return Payment.findOne(params).select({ createdAt: 0, hash: 0, __v: 0 });
	},
	async push(id, data){
		return Payment.findByIdAndUpdate(id, { $push: data }, { 'new': true });
	},
	async count(){
		return Payment.count();
	}
};
