import { LCService } from '../../lcs/services';
import { TutorService } from '../../tutors/services';
import setCtx from '../../../helpers/setCtx';
import cal from './cal';

export default async (ctx, body = null) => {
	if(body){
		const result = await cal(body.coords);
		console.log("RESULT: ", result);

		const lcs = await LCService.find()
		const tutors = await TutorService.find();

		const rest = [...lcs, ...tutors];

		let res = [];
					
		for(let i = 0; i <= rest.length; i++){
			if(rest[i].coords.lat <= result.north && rest[i].coords.lat >= result.south){
				if(rest[i].coords.long >= result.west && rest[i].coords.long <= result.east){
					res[i].push(rest[i]);
				}
			}
		}

		return await setCtx(ctx, res);	
	}
}