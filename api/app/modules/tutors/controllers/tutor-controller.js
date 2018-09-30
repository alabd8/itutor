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
};

