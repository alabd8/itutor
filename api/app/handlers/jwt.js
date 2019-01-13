import jwtService from '../services/jwt-service';
import { User } from '../modules/users';
import { Tutor } from '../modules/tutors';
import { LC } from '../modules/lcs';

export default () => async (ctx, next) => {
	const { authorization } = ctx.headers;
	
	if(authorization){
		try{
			const { email } = await jwtService.verify(authorization);
			
			const user = await User.findOne({ email });
			
			if(user){
				ctx.state.user = user;
			}
	
			const tutor = await Tutor.findOne({ email });
			
			if(tutor){
				ctx.state.user = tutor;
			}
	
			const lc = await LC.findOne({ email })

			if(lc){
				ctx.state.user = lc;
			}
			
			if(user == null && tutor == null && lc == null){
				ctx.throw(403, { message: 'Forbidden. Unauthorized' });
			}
		}catch(ex){
			ctx.throw(401, { message: 'Unauthorized. Invalid Token' });
		}
	}else{
		ctx.state.user = false;
	}

	await next();
}