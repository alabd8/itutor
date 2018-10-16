import pick from 'lodash/pick';
import { User } from '../../users';
import { Tutor } from '../../tutors';
import { LC } from '../../lcs';
import { Admin } from '../../admin';
// import { Moderator } from '../../moderator';
import jwtService from '../../../services/jwt-service';
import setParamsForImage from '../../../helpers/setParamsForImage';
import checkEnumValues from '../../../helpers/checkEnumValues';
import setCtx from '../../../helpers/setCtx';
import { UserService } from '../../users/services';
import { TutorService } from '../../tutors/services';
import { LCService } from '../../lcs/services';

export default {
	async signup(ctx){
		const userData = pick(ctx.request.body, User.createFields);
			  userData.img = await setParamsForImage(ctx);

		await checkEnumValues(ctx);

		const { _id } = await UserService.createUser(userData);
		const user = await UserService.getUserWithPublicFields({ _id });
		
		await setCtx(ctx, user);
	}, 

	async login(ctx){
		const { email, password } = ctx.request.body;

		const [ user, tutor, lc, admin ] = await Promise.all([
			await User.findOne({ email }),
			await Tutor.findOne({ email }),
			await LC.findOne({ email }),
			await Admin.findOne({ email }),
			// await Moderator.findOne({ email }),
		]);

		if(!user && !tutor && !lc && !admin){
			ctx.throw(400, { message: 'User not found' });
		}

		if(!(user || tutor || lc || admin).comparePasswords(password)){
			ctx.throw(400, { message: 'Invalid password' });
		}
		
		const token = await jwtService.genToken({ email });
		
		ctx.body = { data: token };

	},

	async access(ctx){
		const {
			state: {
				user,
			}
		} = ctx;

		await setCtx(ctx, { user: user });
	},

	async currentUser(ctx){
		const {
			state: {
				user: { 
					hash,
					role,
				},
				student,
			}
		} = ctx;

		if(student.hash != hash || role != 'student'){
			ctx.throw(403, `Forbidden. Student with hash ${student.hash} does not belong to user with hash ${hash}`);
		}

		await setCtx(ctx, { user: user });
	},

	async deleteUser(ctx){
		const { 
			state: { 
				user: {
					role,
					hash,
				},
				student,
			}
		} = ctx;

		if(student.hash != hash || role != 'student'){
			ctx.throw(403, `Forbidden. Student with hash ${student.hash} does not belong to user with hash ${hash}`);
		}

		await student.remove();

		await setCtx(ctx, { hash: student.hash });
	},
};

