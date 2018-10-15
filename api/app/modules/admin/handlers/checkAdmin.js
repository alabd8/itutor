export default () => async (ctx, next) => {
	if(!ctx.state.user){
		ctx.throw(403, { message: 'Forbidden' });
	}

	if(ctx.state.user.role = 10){
		await next();
	}else{
		ctx.throw(403, { message: 'Forbidden' });
	}
};