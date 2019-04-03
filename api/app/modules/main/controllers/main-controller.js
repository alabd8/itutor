import pick from 'lodash/pick';
import setCtx from '../../../helpers/setCtx';
import search from '../helpers/search';
import filter from '../helpers/filter';
import menu from '../helpers/menu';
import { infoLog, debLog } from '../../../utils/logs/logger';
import calAndFind from '../helpers/calAndFind';
import searchTags from '../helpers/searchTags';
import validator from '../helpers/validator';
// import { valid1, valid2 } from '../constants';
import { UserService, PaymentService } from '../../users/services';

export default {
	async main(ctx){
		const {
			request: {
				body
			}
		} = ctx;

		infoLog.info('Request to - /: ', ctx);

		await validator(ctx, body);

		infoLog.info('Response to - /: ', ctx.body);

	},

	async home(ctx){
		const {
			state: {
				user,
			},
			request: {
				body: {
					data
				}
			}
		} = ctx;

		infoLog.info('Request to - /home & /search: ', ctx);
		
		await search(ctx, user, data);

		infoLog.info('Response to - /home & /search: ', ctx.body);

	},

	async selected(ctx){
		const {
			state: {
				user
			},
			request: {
				body: {
					data
				}
			}
		} = ctx;

		infoLog.info('Request to - /home/select: ', ctx);
		
		await searchTags(ctx, user, data);

		infoLog.info('Response to - /home/select: ', ctx.body);

	},

	async search(ctx){
		const {
			state: {
				user
			},
			request: {
				body
			}
		} = ctx;
		
		infoLog.info('Request to - /home/results: ', ctx);

		const result = await calAndFind(body);
		
		await filter(ctx, user, result, body);

		infoLog.info('Response to - /home/results: ', ctx.body);

	},

	async menu(ctx){
		const {
			state: {
				user
			}
		} = ctx;

		infoLog.info('Request to - /menu: ', ctx);
		
		// await menu(ctx, user);
		ctx.body = { user }
		infoLog.info('Response to - /menu: ', ctx.body);

	},

	async payment(ctx){
		const {
			state: { 
				user: { hash },
				person,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		if(hash != person.hash){
			ctx.throw(403, `Forbidden. User hash with ${hash} 
					  does not belong to user with hash ${person.hash}`);
		}	
		if(!data.pay_state){
			ctx.throw(400, 'Invalid credentials');
		}
		try{
			const user = await UserService.updateUser(data, person);
			await PaymentService.createPayment({ userHash: user.hash, id: user.uniqueID,  
												 params: { state: user.pay_state } });
		}catch(e){
			ctx.throw(400, 'Can not create payment');
		}

		ctx.status = 200;
		ctx.body = { message: 'success' };
	},

	async check(ctx){
		const {
			state: {
				user,
			}
		} = ctx;

		infoLog.info('Request to - /aliveoprstate/checkTrack: ', ctx);
		debLog.debug('Request to - /aliveoprstate/checkTrack: ', ctx);
	}
};
