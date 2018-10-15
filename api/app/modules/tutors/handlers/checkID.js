import { Tutor } from '../';

export default () => async (id, ctx, next) => {
	const tutor = await Tutor.findOne({ _id: id });
	console.log("HERE IS TUTOR: ", tutor);

	if(!tutor){
		ctx.throw(404, `Tutor with hash "${hash}" not found`);
	}

	ctx.state.id = id;

	await next();
};