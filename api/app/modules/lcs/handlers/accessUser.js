export default () => async (ctx, next) => {
	const { authorization } = ctx.headers;

	if(!authorization){
		ctx.throw(403, { message: 'Forbidden' });
	}

	await next();
};