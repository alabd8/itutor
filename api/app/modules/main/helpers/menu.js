import { LCService } from '../../lcs/services';
import { TutorService } from '../../tutors/services';
import { UserService } from '../../users/services';
import setCtx from '../../../helpers/setCtx'; 


export default async (ctx, user = null) => {
	if(user) {
		try{
			let user = await UserService.getUserWithPublicFields(user);
		
			if(user){
				return await setCtx(ctx, { user: user, content: 'Избранные' });
			}

			let tutor = await TutorService.searchTutor(user);

			if(tutor){
				return await setCtx(ctx, { user: tutor, content: 'Избранные' });
			}

			let center = await LCService.findOne(user);

			if(center){
				return await setCtx(ctx, { user: center, content: 'Избранные' });
			}	

			if(!(user && tutor && center)){
				ctx.throw(404, `Error. Invalid data`);
			}
		}catch(ex){
			ctx.throw(404, ...ex);
		}
	}
}