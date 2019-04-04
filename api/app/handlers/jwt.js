import base64 from 'base-64';
import utf8 from 'utf8';

import jwtService from '../services/jwt-service';

import { User } from '../modules/users';
import { login, pw } from '../modules/main/constants';

export default () => async (ctx, next) => {
	const { authorization } = ctx.headers;
	console.log(ctx.request.ip);
	if(authorization){
		try{
			const encoded = authorization.split(' ');
			if(encoded[0] && encoded[1]){
				const bytes = base64.decode(encoded[1]);
				const text = utf8.decode(bytes);

				const encoded2 = text.split(':');

				if(login === encoded2[0] && pw === encoded2[1]){
					return await next();
				}else if(encoded.legth > 2 || encoded2[0] != login || encoded2[1] != pw){
					ctx.status = 200;
					ctx.body = { "result": { "allow": -32504 } };
					
					return ctx;
				}
			}
			const { email } = await jwtService.verify(authorization);

			const user = await User.findOne({ email });	
			if(user){
				ctx.state.user = user;
			}
			
			if(!user){
				ctx.throw(403, { message: 'Forbidden. Unauthorized' });
			}
		}catch(ex){
			ctx.throw(401, { message: `Unauthorized. Invalid Token` });
		}
	}else{
		ctx.state.user = false;
	}

	await next();
}
