import pick from 'lodash/pick';
import { Tutor } from '../models';
import setParamsForImage from '../../../helpers/setParamsForImage';
import checkEnumValues from '../../../helpers/checkEnumValues';
import setCtx from '../../../helpers/setCtx';
import { TutorService } from '../services';

export default {
	async signup(ctx){
		const tutorData = pick(ctx.request.body, Tutor.createFields);
			  tutorData.img = await setParamsForImage(ctx);
		
		await checkEnumValues(ctx);

		const { _id } = await TutorService.createTutor(tutorData);
		const tutor = await TutorService.searchTutor(_id);

		await setCtx(ctx, tutor);
	},

	async update(ctx){
		const {
			state: {
				user,
				tutor,
			},
			request: {
				body,
			}
		} = ctx;

		if(tutor.hash !== user.hash){
			ctx.throw(403, `Forbidden. Tutor with hash ${tutor.hash} does not belong to user with hash ${user.hash}`);
		}

		const newData = pick(body, Tutor.createFields);
		const updatedTutor = await TutorService.updateTutor(newData, tutor);

		await setCtx(ctx, [{ user: user }, { tutor: updatedTutor }]);
	},

	async getTutor(ctx){
		const {
			state: {
				user,
				tutor,
			}
		} = ctx;

		const tutorData = pick(tutor, Tutor.createFields);

		await setCtx(ctx, [{ user: user}, { tutor: tutorData }]);
	},

	async delete(ctx){
		const { 
			state: { 
				user,
				tutor,
			}
		} = ctx;

		if(tutor.hash != user.hash){
			ctx.throw(403, `Forbidden. Tutor with hash ${tutor.hash} does not belong to user with hash ${user.hash}`);
		}

		await tutor.remove();

		await setCtx(ctx, [{ user: user }, { hash: tutor.hash }]);
	},
};

