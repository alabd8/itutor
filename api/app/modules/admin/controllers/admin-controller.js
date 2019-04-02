import { infoLog } from '../../../utils/logs/logger';
import setCtx from '../../../helpers/setCtx';
import searchUser from '../helpers/searchUser';
import generateFields from '../helpers/generateFields';

import { UserService } from '../../users/services';

export default {
	async getAdministrators(ctx){
		const { 
			request: {
				body: { data }
			},
			state: {
				user: {
					role,
					hash
				}
			}
		} = ctx;
		infoLog.info('Request to - /admin/administrators: ', ctx);

		if(!hash || role != 'admin'){
			ctx.throw(403, `Forbidden`);
		}
		if(data === 'getAdmins' || role === 'admin'){
			const administrators = await UserService.find({ role: 'admin' });
			await setCtx(ctx, { administrators });
		}

		infoLog.info('Response to - /admin/administrators: ', ctx.body);
	},

	async createModerator(ctx){
		const {
			state: {
				user: { role, hash }
			},
			request: { 
				body
			}
		} = ctx;
		infoLog.info('Request to - /admin/create/moderator: ', ctx);

		if(!hash || role !== 'admin'){
			ctx.throw(403, `Forbidden`);
		}

		let newModerator = await generateFields(body),
		   moderator;

		if(newModerator){
			try{
				moderator = await UserService.createUser(newModerator);
			}catch(e){
				ctx.throw(400, { message: e });
			}		
		}

		ctx.status = 201;
		ctx.body = { moderator };

		infoLog.info('Response to - /admin/create/moderator: ', ctx.body);
	},
	
	async defineUser(ctx){
		const { 
			request: {
				body: { data }
			},
			state: {
				user: { role, hash }
			}
		} = ctx;
		infoLog.info('Request to - /admin/getusers: ', ctx);

		if(!hash || role != 'admin'){
			ctx.throw(403, `Forbidden`);
		}

		const users = await searchUser(data, role);
		await setCtx(ctx, { users });

		infoLog.info('Response to - /admin/getusers: ', ctx.body);
	},

	async genKeyForCenter(ctx){
		const {
			state: {
				user: { role, hash }
			},
			request: { 
				body: { data }
			}
		} = ctx;
		infoLog.info('Request to - /admin/center: ', ctx);

		if(!hash || role !== 'admin'){
			ctx.throw(403, `Forbidden`);
		}
		let random;
		if(data){
			try{
				let lc = await UserService.findOne({ email: data });
				random = Math.ceil(Math.random() * 999999999);
				await UserService.updateUser({ code: random }, lc);
			}catch(e){
				ctx.throw(400, { message: e });
			}
			
		}

		ctx.body = { message: random };

		infoLog.info('Response to - /admin/center: ', ctx.body);
	}
}