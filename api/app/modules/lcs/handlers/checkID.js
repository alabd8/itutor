export default () => async (id, ctx, next) => {
	ctx.state.id = id;

	await next();
};