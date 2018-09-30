import pick from 'lodash/pick';
import { User, User_Params } from '../../users';
import { Tutor } from '../../tutors';
import { LC } from '../../lcs';
import jwtService from '../../../services/jwt-service';
import setParamsForImage from '../../../helpers/setParamsForImage';
import checkEnumValues from '../../../helpers/checkEnumValues';
import setCtx from '../../../helpers/setCtx';
import promiseAll from '../helpers/promiseAll';
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

		const [ user, tutor, lc ] = await Promise.all([
			await User.findOne({ email }),
			await Tutor.findOne({ email }),
			await LC.findOne({ email }),
		]);

		if(!user && !tutor && !lc){
			ctx.throw(400, { message: 'Not found' });
		}

		if(!(user || tutor || lc).comparePasswords(password)){
			ctx.throw(400, { message: 'Invalid password' });
		}

		const token = await jwtService.genToken({ email });

		ctx.body = { data: token };

	},

	async currentUser(ctx){
		const {
			state: {
				user: { 
					_id,
				},
			},
		} = ctx;

		await promiseAll(ctx, _id);
	},
};

