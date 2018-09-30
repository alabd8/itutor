import { LC } from '../';

export default () => async (hash, ctx, next) => {
	const lc = await LC.findOne({ hash });

	if(!lc){
		ctx.throw(404, `Learning Centre with hash "${hash}" not found`);
	}

	ctx.state.id = lc;

	await next();
};