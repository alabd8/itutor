import { User } from '../models';

export default {
	async createUser(data){
		try{
			return User.create(data);
		}catch(ex){
			throw new AppError({ status: 400, ...ex });
		}
	},

	async getUserWithPublicFields(params){
		return User.findOne(params).select({ password: 0, createdAt: 0, updatedAt: 0, __v: 0 });
	},
};
