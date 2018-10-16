import { Tutor } from '../';

export default () => async (hash, ctx, next) => {
	const tutor = await Tutor.findOne({ hash });

	if(!tutor){
		ctx.throw(404, `Tutor with hash "${hash}" not found`);
	}

	ctx.state.tutor = tutor;

	await next();
};