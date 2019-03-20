export default () => async (ctx, next) => {
	if(!ctx.state.user){
		ctx.throw(403, { message: 'Forbidden' });
	}

	if(ctx.state.user.role !== 'admin'){
		ctx.throw(403, { message: 'Forbidden' });
	}

	await next();
};