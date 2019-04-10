import { UserService } from '../../users/services';
import { User } from '../../users';
import setCtx from '../../../helpers/setCtx'; 

export default async (ctx, user, result, body = null) => {
	const title = body.title;
	const category = body.category;
	const data = async (role) => {
		let data;
		if(role){
			data = { role, 'page.course.title': title, 'page.course.category': category }
		}else{
			data = { 'page.course.title': title, 'page.course.category': category }
		}
		return data;
	}
	const recommended = await UserService.getRecommended({ recommended: true });
	
	if(body.data === 'center'){
		const centers = await UserService.getRecommended(await data('center'));
		return await setCtx(ctx, [{ user }, { centers }, { recommended },  { resultByCoords: result } ]);
	}else if(body.data === 'tutor'){
		const tutors = await UserService.getRecommended(await data('tutor'));
		return await setCtx(ctx, [{ user }, { tutors }, { recommended }, { resultByCoords: result } ]);
	}else if(body.data === 'both'){
		const both = await User.find(await data());
		return await setCtx(ctx, [{ user }, { both }, { recommended }, { resultByCoords: result } ]);
	}else{
		ctx.throw(404, `Error data`);
	}
}