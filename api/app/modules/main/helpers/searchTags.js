import setCtx from '../../../helpers/setCtx';
import constants from '../../lcs/constants';
import { TutorService } from '../../tutors/services';
import { LCService } from '../../lcs/services';

export default async (ctx, data = null) => {
	if(data === 'langTypes'){
		console.log("world");
		const titles = await constants.getLanguages();
		return await setCtx(ctx, titles);
	}else if(data === 'scienceTypes'){
		const titles = await constants.getSciences();
		return await setCtx(ctx, titles);
	}else if(data === 'inforTypes'){
		const titles = await constants.getInformation();
		return await setCtx(ctx, titles);
	}else if(data === 'profTypes'){
		const titles = await constants.getProf();
		return await setCtx(ctx, titles);
	}else if(data === 'extraTypes'){
		const titles = await constants.getExtra();
		return await setCtx(ctx, titles);
	}else if(data === 'creativeTypes'){
		const titles = await constants.getCreative();
		return await setCtx(ctx, titles);
	}else if(data === 'combinedTypes'){
		const titles = await constants.getCombined();
		return await setCtx(ctx, titles);
	}else if(data === 'unpaidTypes'){
		const titles = await constants.getUnpaid();
		return await setCtx(ctx, titles);
	}else if(Array.isArray(data)){
		const findTutors = await TutorService.getRecommended({ title: [data] });
		const findLCs = await LCService.getRecommended({ title: [data] });
		return await setCtx(ctx, [findTutors, findLCs]);
	}else if(!data){
		ctx.throw(404, `Type error`);
	}
};