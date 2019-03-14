import setCtx from '../../../helpers/setCtx';
import constants from '../../lcs/constants';
import { UserService } from '../../users/services';

export default async (ctx, user, data = null) => {
	if(data === 'languages'){
		const titles = await constants.getLanguages();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'sciences'){
		const titles = await constants.getSciences();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'information'){
		const titles = await constants.getInformation();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'prof'){
		const titles = await constants.getProf();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'extra'){
		const titles = await constants.getExtra();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'сreative'){
		const titles = await constants.getCreative();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'combined'){
		const titles = await constants.getCombined();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'unpaid'){
		const titles = await constants.getUnpaid();
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