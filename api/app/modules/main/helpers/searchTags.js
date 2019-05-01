import setCtx from '../../../helpers/setCtx';
import constants from '../../lcs/constants';
import { UserService } from '../../users/services';

export default async (ctx, user, data = null) => {
	if(data === 'languages'){
		const titles = constants.getLanguages();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'sciences'){
		const titles = constants.getSciences();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'information'){
		const titles = constants.getInformation();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'prof'){
		const titles = constants.getProf();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'extra'){
		const titles = constants.getExtra();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'сreative'){
		const titles = constants.getCreative();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'combined'){
		const titles = constants.getCombined();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'unpaid'){
		const titles = constants.getUnpaid();
		return await setCtx(ctx, { user, titles });
	}else if(data){
		const findByCategories = await UserService.find({ category: data });
		return await setCtx(ctx, [{ user }, { findByCategories }]);
	}else if(Array.isArray(data)){
		const findByCategories = await UserService.find({ category: data });
		return await setCtx(ctx, [{ user }, { findByCategories }]);
	}else{
		ctx.throw(404, `Type error`);
	}
};