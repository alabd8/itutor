import { LC } from '../../lcs';
import { Tutor } from '../../tutors';

export default () => async (hash, ctx, next) => {
	const lc = await LC.findOne({ hash });

	if(lc){
		ctx.state.id = lc;
	}

	const tutor = await Tutor.findOne({ hash });

	if(tutor){
		ctx.state.id = tutor;
	}

	if(!lc && !tutor){
		ctx.throw(404, `Learning Centre or Tutor with hash "${hash}" not found`);		
	}

	await next();
};