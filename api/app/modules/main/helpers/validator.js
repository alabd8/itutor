import setCtx from '../../../helpers/setCtx';
import { UserService } from '../../users/service';

export default async (ctx, body = null) => {
    if(!body){
	if(body.method == 'CheckPerformTransaction'){
		try{
			let user = await UserService.findOne({ uniqueID: body.params.account.itutor });
			if(user.params.state
    		}
}
