import pick from 'lodash/pick';
import setCtx from '../../../helpers/setCtx';
import search from '../helpers/search';
import filter from '../helpers/filter';
import menu from '../helpers/menu';
import { infoLog, debLog } from '../../../utils/logs/logger';
import calAndFind from '../helpers/calAndFind';
import searchTags from '../helpers/searchTags';
import { LCService } from '../../lcs/services';
import { TutorService } from '../../tutors/services';

export default {
	async main(ctx){
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
		
		await menu(ctx, user);

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
	},

	async aboutLC(ctx){
		const { 
			state: {
				user: {
					hash
				}
			}
		} = ctx;

		const lc = await LCService.searchLCs({ hash });

		ctx.body = lc;
	},

	async aboutT(ctx){
		const { 
			state: {
				user: {
					hash
				}
			}
		} = ctx;																																							

		const tutor = await TutorService.searchTutors({ hash });

		ctx.body = tutor;
	},

	async menuCourses(ctx){
		const {
			state: {
				user
			}
		} = ctx;

		await setCtx(ctx, { user: user });
	}

	
};