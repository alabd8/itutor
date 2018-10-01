import { LCService } from '../../lcs/services';
import { TutorService } from '../../tutors/services';
import { UserService } from '../../users/services';
import setCtx from '../../../helpers/setCtx'; 


export default async (ctx, user) => {
	try{
		return await setCtx(ctx, { user: user, content: 'Избранные' });
	}catch(ex){
		ctx.throw(404, ...ex);
	}
}