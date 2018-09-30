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
			request: {
				body: {
					data,
				}
			}
		} = ctx;
		
		await search(ctx, data);
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

		await searchTags(ctx, data);
	},

	async search(ctx){
		const {
			request: {
				body,
			}
		} = ctx;
		
		await filter(ctx, body);
		
	},

	async searchMap(ctx){
		const {
			request: {
				body,
			}
		} = ctx;

		console.log("BODY: ", body);

		await calAndFind(ctx, body);
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

};