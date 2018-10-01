import pick from 'lodash/pick';
import setParamsForImage from '../../../helpers/setParamsForImage';
import getTagsFromCotegories from '../helpers/getTagsFromCotegories';
import checkEnumValues from '../../../helpers/checkEnumValues';
import setCtx from '../../../helpers/setCtx';
import { LC } from '../../lcs';
import { LCService } from '../../lcs/services';

export default {
	async verify(ctx){
		const {
			request: {
				body: {
					verify,
				}
			}
		} = ctx;
		console.log("verify: ", verify);
	},

	async signup(ctx){
		const lcData = pick(ctx.request.body, LC.createFields);
			  lcData.img = await setParamsForImage(ctx);

		await checkEnumValues(ctx);
				
		const { _id } = await LCService.createLC(lcData);
		const lc = await LCService.findOne({ _id });

		await setCtx(ctx, lc);	
					
	},

	async lc(ctx){
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

		if(user || data === 'getCenterInfo'){
			const lc = await LCService.findOne(user);

			await setCtx(ctx, lc);	
		}
	},

	async cotegory(ctx){
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

		if(user || data === 'getCenterCourses'){
			const lc = await LCService.findOne(user);

			await setCtx(ctx, lc.title);	
		}
	},	

	async select(ctx){
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

		if(user || data ===  'getTutorCourses'){		
			const lc = await LCService.findOne(user);

			await getTagsFromCotegories(ctx, lc.title);	
		}
	},

	async courseList(ctx){
		const {
			state: {
				user,
				id,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		if(user || data === 'aboutCourse'){
			const lc = await LCService.findOne(id);

			await setCtx(ctx, lc);	
		}
	},

	async teachers(ctx){
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

		if(user || data === 'getTeachers'){
			const center = await LCService.find(user);

			await setCtx(ctx, center.teachers);	
		}
	},

	async teacher(ctx){
		const {
			state: {
				user,
				id,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		if(user || data === 'getCenterTeacher'){
			const teacher = await LCService.findOne(id);

			await setCtx(ctx, teacher);	
		}
	},


	async update(ctx){
		const {
			request: {     
				body,
			},
			state: {
				user: {
					hash,
					role,
				},
				lc,
			},
		} = ctx;

		if(lc.userHash != hash){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		if(role !== 10){
			ctx.throw(403, `You aren't allowed to update`);
		}

		const newData = pick(body, LC.createFields);
		const updatedLC = await LCService.updateLC(newData, lc);

		ctx.body = { data: updatedLC };
	},

	async delete(ctx){
		const {
			state: {
				user: {
					hash,
					role,
				},
				lc,
			},
		} = ctx;

		if(lc.userHash !== hash){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.userHash}" doesn't belong to user with hash "${hash}"`);
		}

		if(role !== 10){
			ctx.throw(403, `You aren't allowed to delete`);
		}

		await lc.remove();

		ctx.body = { data: { hash: lc.hash }};
	},

	async getLC(ctx){
		const { state : { lc } } = ctx;

		ctx.body = { data: pick(lc, LC.createFields) }; 
	}
}