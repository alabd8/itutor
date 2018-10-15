import pick from 'lodash/pick';
import jwtService from '../../../services/jwt-service';
import setCtx from '../../../helpers/setCtx';
import search from '../helpers/search';
import filter from '../helpers/filter';
import menu from '../helpers/menu';
import calAndFind from '../helpers/calAndFind';
import searchTags from '../helpers/searchTags';
import { LCService } from '../../lcs/services';
import { TutorService } from '../../tutors/services';

export default {
	async main(ctx){
		const {
			state: {
				user,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		await search(ctx, user, data);
	},

	async selected(ctx){
		const {
			state: {
				user,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		await searchTags(ctx, user, data);
	},

	async search(ctx){
		const {
			state: {
				user,
			},
			request: {
				body,
			}
		} = ctx;
		
		const result = await calAndFind(body);
		
		await filter(ctx, user, result, body);
	},

	async menu(ctx){
		const {
			state: {
				user,
			}
		} = ctx;

		await menu(ctx, user);
	},


	async aboutLC(ctx){
		const { 
			state: {
				user: {
					hash,
				},
			},
		} = ctx;

		const lc = await LCService.searchLCs({ hash });

		ctx.body = lc;
	},

	async aboutT(ctx){
		const { 
			state: {
				user: {
					hash,
				},
			},
		} = ctx;																																							

		const tutor = await TutorService.searchTutors({ hash });

		ctx.body = tutor;
	},

	async menuCourses(ctx){
		const {
			state: {
				user,
			}
		} = ctx;

		await setCtx(ctx, { user: user });
	},

	
};