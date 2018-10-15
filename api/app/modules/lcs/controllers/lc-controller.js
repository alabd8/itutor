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
		const lcData = { 
			...pick(ctx.request.body, LC.createFields),
			img: await setParamsForImage(ctx),
			authorized: true,
		};

		await checkEnumValues(ctx);
				
		const { _id } = await LCService.createLC(lcData);
		const lc = await LCService.findOne({ _id });

		await setCtx(ctx, lc);	
					
	},

	async courses(ctx){
		const {
			state: {
				user,
				lc,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		if(lc.hash != user.hash && user.role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const result = await LCService.findOne(user);

		await setCtx(ctx, [{ user: user }, { centerCourses: result.course }]);
	
	},	

	async update(ctx){
		const {
			request: {     
				body,
			},
			state: {
				user: {
					role,
					hash,
				},
				lc,
				id,
			},
		} = ctx;

		if(lc.hash != hash && role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const pull = await LCService.pull(lc._id, id);
		const updatedLC = await LCService.push(lc._id, ctx.request.body);

		await setCtx(ctx, { data: updatedLC });
	},

	async updateLC(ctx){
		const {
			request: {     
				body,
			},
			state: {
				user: {
					role,
					hash,
				},
				lc,
			},
		} = ctx;

		if(lc.hash != hash && role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const newData = pick(body, LC.createFields);
		const updatedLC = await LCService.updateLC(newData, lc);

		ctx.body = { data: updatedLC };
	},

	async create(ctx){
		const {
			state: {
				user: {
					role,
					hash,
				},
				lc,
			}
		} = ctx;

		if(lc.hash != hash && role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		console.log(ctx.request.body);

		const result = await LCService.push(lc._id, ctx.request.body);

		ctx.status = 201;
		ctx.body = { data: result };
	},

	async select(ctx){
		const {
			state: {
				user,
				lc,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		if(user || data ===  'getTutorCourses'){		
			const lc = await LCService.findOne(lc);

			await getTagsFromCotegories(ctx, data, user, lc.title);	
		}
	},

	async showCourses(ctx){
		const {
			state: {
				user,
				lc,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		try{
			const result = await LCService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { lc_courses: result.course }]);	
		}catch(ex){
			ctx.throw(400, { message: `Error. Can not get courses` });	
		}
	},

	async showCourse(ctx){
		const {
			state: {
				user,
				lc,
				id,
			},
			request: {
				body: {
					state,
				}
			}
		} = ctx;

		try{
			const course = await LCService.findOne(id);
			const lc = await LCService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { lc: lc }, { course: course }]); 
		}catch(ex){
			ctx.throw(400, { message: 	`Error. Can not get course` });
		}
	},

	async teachers(ctx){
		const {
			state: {
				user,
				lc,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		try{
			const lc = await LCService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { lc: lc }, { teachers: lc.teachers }]);	
		}catch(ex){
			ctx.throw(400, { message: 	`Error. Can not get teachers` });
		}
	},

	async teacher(ctx){
		const {
			state: {
				user,
				lc,
				id,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		try{
			const teacher = await LCService.findOne(id)
			const lc = await LCService.findOne(id);

			await setCtx(ctx, [{ user: user }, { lc: lc }, { teacher: teacher }]);	
		}catch(ex){
			ctx.throw(400, { message: 	`Error. Can not get teacher` });
		}
	},

	async gallery(ctx){
		const {
			state: {
				user,
				lc,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		try{
			const lc = await LCService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { lc: lc }, { gallery: lc.gallery }]);
		}catch(ex){
			ctx.throw(400, { message: 	`Error. Can not get gallery` });
		}
	},

	async delete(ctx){
		const {
			state: {
				user: {
					hash,
					role,
				},
				lc,
				id,
			},
		} = ctx;

		if(lc.hash !== hash && role !== 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const updatedLC = await LCService.pull(lc._id, id);

		ctx.body = { data: updatedLC };
	},

	async getLC(ctx){
		const { state : { lc } } = ctx;

		ctx.body = { data: pick(lc, LC.createFields) }; 
	}
}