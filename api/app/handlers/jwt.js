import jwtService from '../services/jwt-service';
import { User } from '../modules/users';

export default () => async (ctx, next) => {
	const { authorization } = ctx.headers;
	
	if(authorization){
		try{
			const { email } = await jwtService.verify(authorization);
			
			const user = await User.findOne({ email });
			
			if(user){
				ctx.state.user = user;
			}
			
			if(user == null){
				ctx.throw(403, { message: 'Forbidden. Unauthorized' });
			}
		}catch(ex){
			ctx.throw(401, { message: `Unauthorized. Invalid Token --- ${ex}` });
		}
	}else{
		ctx.state.user = false;
	}

	await next();
}