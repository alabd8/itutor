import pick from 'lodash/pick';

import { User } from '../../users';
// import { Moderator } from '../../moderator';
import setParamsForImage from '../../../helpers/setParamsForImage';
import checkEnumValues from '../../../helpers/checkEnumValues';
import setCtx from '../../../helpers/setCtx';
import findUser from '../../../helpers/findUser';
import { infoLog } from '../../../utils/logs/logger';
import issueTokenPair from '../../../helpers/issueTokenPair';
import { UserService } from '../../users/services';

export default {
	async signup(ctx){
		const userData = pick(ctx.request.body, User.createFields);
			userData.img = await setParamsForImage(ctx);

		infoLog.info('Request to - /menu/auth/signup/student: ', ctx);

		await checkEnumValues(ctx);

		const { _id } = await UserService.createUser(userData);
		const user = await UserService.getUserWithPublicFields({ _id });
		
		await setCtx(ctx, user);
		
		infoLog.info('Response to - /menu/auth/signup/student: ', ctx.body);
	}, 

	async login(ctx){
		const { email, password } = ctx.request.body;

		const exist = await findUser(email);

		infoLog.info('Request to - /menu/auth/signin: ', ctx);

		if(!exist){
			ctx.throw(403, { message: 'User not found' });
		}

		if(!(exist).comparePasswords(password)){
			ctx.throw(403, { message: 'Invalid password' });
		}		

		ctx.body = await issueTokenPair(email, exist._id);

		infoLog.info('Response to - /menu/auth/signin: ', ctx.body);

	},

	async access(ctx){
		const {
			state: {
				user
			}
		} = ctx;

		infoLog.info('Request to - /menu/auth/access: ', ctx);

		await setCtx(ctx, { user: user });
		
		infoLog.info('Response to - /menu/auth/access: ', ctx.body);

	},

	async currentUser(ctx){
		const {
			state: {
				user: { 
					hash,
					role
				},
				student
			}
		} = ctx;

		infoLog.info('Request to current - /user: ', ctx);

		if(student.hash != hash || role != 'student'){
			ctx.throw(403, `Forbidden. Student with hash ${student.hash} does not belong to user with hash ${hash}`);
		}

		await setCtx(ctx, { user: user });

		infoLog.info('Response to current - /user: ', ctx.body);
	},

	async deleteUser(ctx){
		const { 
			state: { 
				user: {
					role,
					hash
				},
				student
			}
		} = ctx;

		infoLog.info('Request to delete - /user: ', ctx);

		if(student.hash != hash || role != 'student'){
			ctx.throw(403, `Forbidden. Student with hash ${student.hash} does not belong to user with hash ${hash}`);
		}

		await student.remove();

		await setCtx(ctx, { hash: student.hash });

		infoLog.info('Response to delete- /user: ', ctx.body);
	}
};

