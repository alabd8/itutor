import setCtx from '../../../helpers/setCtx';
import constants from '../../lcs/constants';
import { TutorService } from '../../tutors/services';
import { LCService } from '../../lcs/services';

export default async (ctx, user, data = null) => {
	if(data === 'languages'){
		const titles = await constants.getLanguages();
		return await setCtx(ctx, { user: user, titles: titles });
	}else if(data === 'sciences'){
		const titles = await constants.getSciences();
		return await setCtx(ctx, { user: user, titles: titles });
	}else if(data === 'information'){
		const titles = await constants.getInformation();
		return await setCtx(ctx, { user: user, titles: titles });
	}else if(data === 'prof'){
		const titles = await constants.getProf();
		return await setCtx(ctx, { user: user, titles: titles });
	}else if(data === 'extra'){
		const titles = await constants.getExtra();
		return await setCtx(ctx, { user: user, titles: titles });
	}else if(data === 'сreative'){
		const titles = await constants.getCreative();
		return await setCtx(ctx, { user: user, titles: titles });
	}else if(data === 'combined'){
		const titles = await constants.getCombined();
		return await setCtx(ctx, { user: user, titles: titles });
	}else if(data === 'unpaid'){
		const titles = await constants.getUnpaid();
		return await setCtx(ctx, { user: user, titles: titles });
	}else if(Array.isArray(data)){
		const findTutors = await TutorService.getRecommended({ title: data });
		const findLCs = await LCService.getRecommended({ title: data });
		return await setCtx(ctx, [{ user: user }, { findTutors: findTutors }, { findLCs: findLCs }]);
	}else if(!data){
		ctx.throw(404, `Type error`);
	}
};