export default () => async (ctx, next) => {
	if(!ctx.state.user || !ctx.state.id){
		ctx.throw(403, { message: 'Forbidden' });
	}

	await next();
};