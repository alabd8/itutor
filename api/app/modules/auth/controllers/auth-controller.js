import pick from 'lodash/pick';
import { infoLog } from '../../../utils/logs/logger';

import checkEnumValues from '../../../helpers/checkEnumValues';
import setCtx from '../../../helpers/setCtx';
import issueTokenPair from '../../../helpers/issueTokenPair';
import extract from '../helpers/extract';
import setParamsForImage from '../../../helpers/setParamsForImage';
import updatingUser from '../../../helpers/updatingUser';

import { User } from '../../users';
import { UserService } from '../../users/services';


export default {
	async signup(ctx){
		infoLog.info('Request to - /menu/auth/signup/student: ', ctx);

		await checkEnumValues(ctx);
		const userData = await extract(ctx);

		const { _id } = await UserService.createUser(userData);
		const user = await UserService.getUserWithPublicFields({ _id });
		
		await setCtx(ctx, user);
		
		infoLog.info('Response to - /menu/auth/signup/student: ', ctx.body);
	}, 

	async login(ctx){
		infoLog.info('Request to - /menu/auth/signin: ', ctx);

		const { email, password } = ctx.request.body;

		const user = await UserService.findOneAndUpdate({ email }, { state: 1 });
		if(!user){
			ctx.throw(403, { 
				message: 'User not found' 
			});
		}

		if(!(user).comparePasswords(password)){
			ctx.throw(403, { 
				message: 'Invalid password' 
			});
		}				
		ctx.body = await issueTokenPair(email, user);

		infoLog.info('Response to - /menu/auth/signin: ', ctx.body);
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
			ctx.throw(403, `Forbidden. Student with hash "${student.hash}" 
							does not belong to user with hash "${hash}"`);
		}

		const result = await UserService.findOne({ hash: student.hash });

		await setCtx(ctx, { data: result });

		infoLog.info('Response to current - /user: ', ctx.body);
	},

	async updateStudent(ctx){
		const {
			request: { body },
			state: {
				user: {
					role,
					hash
				},
				student
			}
		} = ctx;

		infoLog.info('Request to current - /user/settings: ', ctx);

		if(student.hash !== hash || role !== 'student'){
			ctx.throw(403, `Forbidden. Student with hash "${student.hash}"
							doesn't belong to user with hash "${hash}"`);
		}

		const newData = pick(body, User.createFields);

		if(newData.role !== 'student'){
			throw new AppError({ status: 400, message: `Error on updating "role"` });			
		}
		let img = setParamsForImage(ctx);			  

		await updatingUser(img, newData, student, ctx);

		infoLog.info('Response to current - /user/settings: ', ctx.body);

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
			ctx.throw(403, `Forbidden. Student with hash "${student.hash}" 
							does not belong to user with hash "${hash}"`);
		}

		await student.remove();

		await setCtx(ctx, { hash: student.hash });

		infoLog.info('Response to delete- /user: ', ctx.body);
	}
};

