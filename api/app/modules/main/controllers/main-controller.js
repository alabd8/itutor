import pick from 'lodash/pick';
import setCtx from '../../../helpers/setCtx';
import search from '../helpers/search';
import filter from '../helpers/filter';
import menu from '../helpers/menu';
import { infoLog, debLog } from '../../../utils/logs/logger';
import calAndFind from '../helpers/calAndFind';
import searchTags from '../helpers/searchTags';
import validator from '../helpers/validator';
import { valid1, valid2 } from '../constants';
import { UserService } from '../../users/services';

export default {
	async main(ctx){
		const {
			request: {
				body,
				ip,
			}
		} = ctx;
		
		console.log('ctx.request.connection: ', ctx.request.connection);
		infoLog.info('Request to - /: ', ctx);

		if(ip === valid1 && ip === valid2){
			await validator(ctx, body);
		}else{
			ctx.status = 200;
			ctx.body = tutor;
		}

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