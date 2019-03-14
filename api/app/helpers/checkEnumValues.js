import { User } from '../modules/users';

export default async (ctx) => {
	const user = User.schema.path('role').enumValues

	if(!user){
		return ctx.throw(400, `Error. Invalid data`);
	}
};