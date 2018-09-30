import { UserService } from '../../users/services';
import { TutorService } from '../../tutors/services';
import { LCService } from '../../lcs/services';
import setCtx from '../../../helpers/setCtx';

export default async (ctx, id) => {
	const [ user, tutor, lc ] = await Promise.all([
		await UserService.getUserWithPublicFields(id),
		await TutorService.searchTutor(id),
		await LCService.findOne(id),
	]);

	if(![user && tutor && lc]){
		ctx.throw(404, `Error. Invalid data`);
	}

	if(user){
		return await setCtx(ctx, user);
	}else if(tutor){
		return await setCtx(ctx, tutor);
	}else if(lc){
		return await setCtx(ctx, lc);
	}
} 