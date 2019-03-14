import { User } from '../../users';

export default () => async (hash, ctx, next) => {
	const user = await User.findOne({ hash }).select({ password: 0 });

	if(!user){
		ctx.throw(404, `Learning Centre with hash "${hash}" not found`);
	}

	ctx.state.lc = user;

	await next();
};