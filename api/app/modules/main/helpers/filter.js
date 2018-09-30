import { LCService } from '../../lcs/services';
import { TutorService } from '../../tutors/services';
import setCtx from '../../../helpers/setCtx'; 

export default async (ctx, user, body = null) => {
	const lcs = await LCService.getRecommended({ recommended: true });
	const tutors = await TutorService.getRecommended({ recommended: true });
	if(body.data === 'center'){
		const centers = await LCService.getRecommended(body.params);
		return await setCtx(ctx, [{ user: user }, { centers: centers}, { recommendedLCs: lcs, recommendedTutors: tutors }]);
	}else if(body.data === 'tutor'){
		const tutors = await TutorService.getRecommended(body.params);
		return await setCtx(ctx, [{ user: user }, { tutors: tutors}, { recommendedLCs: lcs, recommendedTutors: tutors }]);
	}else if(body.data === 'both' || !body.data){
		const centers = await LCService.getRecommended(body.params);
		const tutors = await TutorService.getRecommended(body.params);
		return await setCtx(ctx, [{ user: user }, { centers: centers, tutors: tutors }, { recommendedLCs: lcs, recommendedTutors: tutors }]);
	}else if(!body){
		ctx.throw(404, `Error data`);
	}
}