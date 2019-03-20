import { UserService } from '../../users/services';
import setCtx from '../../../helpers/setCtx';
import constants from '../../lcs/constants';

export default async (ctx, user, data = null) => {
	if(data === 'getRecommended'){
		const recommended = await UserService.getRecommended({ recommended: true });
		return await setCtx(ctx, { user, recommended });	
	}else if(data === 'getCourses'){
		const titles = await constants.getTitles();
		return await setCtx(ctx, { user, titles });
	}else if(data === 'getTags'){
		const tags = await constants.getTags();
		return await setCtx(ctx, { user, tags });
	}else{
	 	const recommended = await UserService.getRecommended({ recommended: true });
		const titles = await constants.getTitles();
		const tags = await constants.getTags();
		return	await setCtx(ctx, { user, recommended, content: titles, tags });
	}
};