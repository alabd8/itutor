import pick from 'lodash/pick';

import setParamsForImage from '../../../helpers/setParamsForImage';

import { User } from '../../users';
import { uuidGenerator } from '../../main/constants';

export default async (ctx) => {
    const body = ctx.request.body;
    const role = body.role;
    let userData;
    
		if(role === 'center' || role === 'tutor'){
			userData = { 
                ...pick(body, User.createFields),
                img: await setParamsForImage(ctx),
                uniqueID: uuidGenerator(),
                params: { amount: 500000 }
            }
		}else{
            userData = {
                ...pick(body, User.createFieldsForStudent),
                img: await setParamsForImage(ctx)
            }
        }
    
    return userData;
}