import base64 from 'base-64';
import utf8 from 'utf8';

import { pw, login } from "../constants";

export default () => async (ctx, next) => {
	const { authorization } = ctx.headers;
	
	if(authorization){
		const encoded = authorization.split(' ');
		if(encoded[0] && encoded[1]){
			const bytes = base64.decode(encoded[1]);
			const text = utf8.decode(bytes);

			const encoded2 = text.split(':');

			if(login === encoded2[0] && pw === encoded2[1]){
				return await next();
			}
		}else{
			ctx.status = 200;
			ctx.body = { "id": ctx.request.body.id, "result": null, "error": 
			{ "code": -32504, "message": "Not enough privileges to execute method." } };			
		}
	}else{
		ctx.status = 200;
		ctx.body = { "id": ctx.request.body.id, "result": null, "error": 
		{ "code": -32504, "message": "Not enough privileges to execute method." } };			
	}

	await next();
}