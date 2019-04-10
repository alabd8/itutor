import pick from 'lodash/pick';

import setParamsForImage from '../../../helpers/setParamsForImage';
import uuidGenerator from '../../../helpers/uuidGenerator';

import { User } from '../../users';

export default async (ctx) => {
    const body = ctx.request.body;
    const role = body.role;
    let userData;
    
		if(role === 'center' || role === 'tutor'){
			userData = { 
                ...pick(body, User.createFields),
                img: await setParamsForImage(ctx),
                uniqueID: await uuidGenerator(),
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