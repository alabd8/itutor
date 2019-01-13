import pick from 'lodash/pick';
import { AdminService } from '../services';
import setCtx from '../../../helpers/setCtx';

export default {
	async menu(ctx){
		const {
			state: {
				user
			}
		} = ctx;

		await setCtx(ctx, { user: user });
	},

	async statistics(ctx){
		const {
			state: {
				user
			}
		} = ctx;

		const info = await getStatistics(ctx);

	},	

	async moderators(ctx){
		const {
			state: {
				user
			}	
		} = ctx;
		
		const status = await AdminService.findByStatus();

		await setCtx(ctx, status);
	}
}