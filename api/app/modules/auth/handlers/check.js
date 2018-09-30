import { User } from '../../users';
import { Tutor } from '../../tutors';
import { LC } from '../../lcs';

export default () => async (hash, ctx, next) => {
	const [ user, tutor, lc ] = await Promise.all([
		await User.findOne({ hash }),
		await Tutor.findOne({ hash }),
	]);

	if(!user && !tutor){
		ctx.throw(404, `hash ${hash} not found`);
	}
	 
	if(user) ctx.state.user = user;
	if(tutor) ctx.state.user = tutor;

	await next();
};