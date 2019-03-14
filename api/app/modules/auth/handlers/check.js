import { User } from '../../users';

export default () => async (hash, ctx, next) => {
	const user = await User.findOne({ hash }).select({ password: 0 });

	if(!user){
		ctx.throw(404, `Student hash ${hash} not found`);
	}	 
	ctx.state.student = user;
	
	await next();
};