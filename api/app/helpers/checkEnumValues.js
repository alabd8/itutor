import { Tutor } from '../modules/tutors';
import { User } from '../modules/users';
import { LC } from '../modules/lcs';

export default async (ctx) => {
	const [ tutor, user, lc ] = await Promise.all([
		Tutor.schema.path('role').enumValues,
		User.schema.path('role').enumValues,
		LC.schema.path('role').enumValues
	]);

	if(!tutor && !user && !lc){
		return ctx.throw(400, `Error. Invalid data`);
	}
};