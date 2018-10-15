import { User } from '../../users';

export default () => async (hash, ctx, next) => {
	const student = await User.findOne({ hash })

	if(!student){
		ctx.throw(404, `Student hash ${hash} not found`);
	}
	 
	ctx.state.student = student;

	await next();
};