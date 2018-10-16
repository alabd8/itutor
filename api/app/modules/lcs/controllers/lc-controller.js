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
				user: {
					role,
					hash,
				},
				lc,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		if(lc.hash != hash || role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const result = await LCService.findOne(lc);

		await setCtx(ctx, [{ user: result }, { centerCourses: result.course }]);
	
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

		if(lc.hash != hash || role != 'center'){
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

		if(lc.hash != hash || role != 'center'){
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

		if(lc.hash != hash || role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		console.log(ctx.request.body);

		const result = await LCService.push(lc._id, ctx.request.body);

		ctx.status = 201;
		ctx.body = { data: result };
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

			await setCtx(ctx, [{ user: user }, { lc: result }, { lc_courses: result.course }]);	
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
			const result = await LCService.findOne(lc);
			let set = [];

			for(let i = 0; i <= result.course.length; i++){
				if(result.course[i]){
					if(result.course[i]._id == id){
						set.push(result.course[i]);
					}
				}
			}

			await setCtx(ctx, [{ user: user }, { lc: result }, { course: set }]); 
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
			const result = await LCService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { lc: result }, { teachers: result.teachers }]);	
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
			const result = await LCService.findOne(lc);
			let set = [];
			
			for(let i = 0; i <= result.teachers.length; i++){
				if(result.teachers[i]){
					if(result.teachers[i]._id == id){
						set.push(result.teachers[i]);
					}
				}
			}

			await setCtx(ctx, [{ user: user }, { lc: result }, { teacher: set }]);	
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
			const result = await LCService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { lc: result }, { gallery: result.gallery }]);
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

		if(lc.hash !== hash || role !== 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const updatedLC = await LCService.pull(lc._id, id);

		ctx.body = { data: updatedLC };
	},
}