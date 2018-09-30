import { LCService } from '../../lcs/services';
import { TutorService } from '../../tutors/services';
import setCtx from '../../../helpers/setCtx';
import constants from '../../lcs/constants';

export default async (ctx, data = null) => {
	if(data === 'getRecommended'){
		const lcs = await LCService.getRecommended({ recommended: true });
		const tutors = await TutorService.getRecommended({ recommended: true });
		return await setCtx(ctx, { recommendedLCs: lcs, recommendedTutors: tutors });	
	}else if(data === 'getCourses'){
		const titles = await constants.getTitles();
		return await setCtx(ctx, titles);
	}else if(data === 'getTags'){
		const tags = await constants.getTags();
		return await setCtx(ctx, tags);
	}else if(!data){
	 	const lcs = await LCService.getRecommended({ recommended: true });
		const tutors = await TutorService.getRecommended({ recommended: true });
		const titles = await constants.getTitles();
		const tags = await constants.getTags();
		return	await setCtx(ctx, { recommendedLCs: lcs, recommendedTutors: tutors, content: titles, tags: tags });
	}
};