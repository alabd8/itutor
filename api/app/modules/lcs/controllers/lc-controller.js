import pick from 'lodash/pick';
import setParamsForImage from '../../../helpers/setParamsForImage';
// import getTagsFromCotegories from '../helpers/getTagsFromCotegories';
import { infoLog } from '../../../utils/logs/logger';
import checkEnumValues from '../../../helpers/checkEnumValues';
import setCtx from '../../../helpers/setCtx';
import { LC } from '../../lcs';
import { LCService } from '../../lcs/services';

export default {
	async verify(ctx){
		const {
			request: {
				body: {
					verify
				}
			}
		} = ctx;

		infoLog.info('Request to - /signup/lc/verify: ', ctx);

		console.log("verify: ", verify);
	},

	async signup(ctx){
		const lcData = { 
			...pick(ctx.request.body, LC.createFields),
			img: await setParamsForImage(ctx),
			authorized: true
		};

		infoLog.info('Request to - /menu/auth/signup/center: ', ctx);


		await checkEnumValues(ctx);
				
		const { _id } = await LCService.createLC(lcData);
		const lc = await LCService.findOne({ _id });

		await setCtx(ctx, lc);	

		infoLog.info('Response to - /menu/auth/signup/center: ', ctx.body);
					
	},

	async courses(ctx){
		const {
			state: {
				user: {
					role,
					hash
				},
				lc
			},
			request: {
				body: {
					data
				}
			}
		} = ctx;

		infoLog.info('Request to - /menu/courses/:hash: ', ctx);
		
		if(lc.hash != hash || role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const result = await LCService.findOne(lc);

		await setCtx(ctx, [{ user: result }, { centerCourses: result.course }]);
		
		infoLog.info('Response to - /menu/courses/:hash: ', ctx.body);
	},	

	async update(ctx){
		const {
			request: {     
				body
			},
			state: {
				user: {
					role,
					hash
				},
				lc,
				id
			}
		} = ctx;

		infoLog.info('Request to - /menu/courses/:hash/:id: ', ctx);

		if(lc.hash != hash || role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const pull = await LCService.pull(lc._id, id);
		const updatedLC = await LCService.push(lc._id, ctx.request.body);

		await setCtx(ctx, { data: updatedLC });

		infoLog.info('Response to - /menu/courses/:hash/:id: ', ctx.body);		
	},

	async updateLC(ctx){
		const {
			request: {     
				body
			},
			state: {
				user: {
					role,
					hash
				},
				lc
			}
		} = ctx;

		infoLog.info('Request to - /menu/contacts/:hash & /menu/settings/:hash: ', ctx);

		if(lc.hash != hash || role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const newData = pick(body, LC.createFields);
		const updatedLC = await LCService.updateLC(newData, lc);

		ctx.body = { data: updatedLC };

		infoLog.info('Response to - /menu/contacts/:hash & /menu/settings/:hash: ', ctx.body);
		
	},

	async create(ctx){
		const {
			state: {
				user: {
					role,
					hash
				},
				lc
			}
		} = ctx;

		infoLog.info('Request to - /menu/courses/:hash/new-course: ', ctx);

		if(lc.hash != hash || role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const result = await LCService.push(lc._id, ctx.request.body);

		ctx.status = 201;
		ctx.body = { data: result };

		infoLog.info('Response to - /menu/courses/:hash/new-course: ', ctx.body);		
	},

	async showCourses(ctx){
		const {
			state: {
				user,
				lc
			},
			request: {
				body: {
					data
				}
			}
		} = ctx;
		
		infoLog.info('Request to - /centers/:hash/courses: ', ctx);

		try{
			const result = await LCService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { lc: result }, { lc_courses: result.course }]);	
		}catch(ex){
			ctx.throw(400, { message: `Error. Can not get courses` });	
		}

		infoLog.info('Response to - /centers/:hash/courses: ', ctx.body);
	},

	async showCourse(ctx){
		const {
			state: {
				user,
				lc,
				id
			},
			request: {
				body: {
					state
				}
			}
		} = ctx;
		
		infoLog.info('Request to - /centers/:hash/courses/:id: ', ctx);

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

		infoLog.info('Response to - /centers/:hash/courses/:id: ', ctx.body);
		
	},

	async teachers(ctx){
		const {
			state: {
				user,
				lc
			},
			request: {
				body: {
					data
				}
			}
		} = ctx;

		infoLog.info('Request to - /centers/:hash/teachers: ', ctx);

		try{
			const result = await LCService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { lc: result }, { teachers: result.teachers }]);	
		}catch(ex){
			ctx.throw(400, { message: 	`Error. Can not get teachers` });
		}

		infoLog.info('Response to - /centers/:hash/teachers: ', ctx.body);

	},

	async teacher(ctx){
		const {
			state: {
				user,
				lc,
				id
			},
			request: {
				body: {
					data
				}
			}
		} = ctx;

		infoLog.info('Request to - /centers/:hash/teachers/:id: ', ctx);
		
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

		infoLog.info('Response to - /centers/:hash/teachers/:id: ', ctx.body);

	},

	async gallery(ctx){
		const {
			state: {
				user,
				lc
			},
			request: {
				body: {
					data
				}
			}
		} = ctx;

		infoLog.info('Request to - /centers/:hash/gallery: ', ctx);

		try{
			const result = await LCService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { lc: result }, { gallery: result.gallery }]);
		}catch(ex){
			ctx.throw(400, { message: 	`Error. Can not get gallery` });
		}

		infoLog.info('Response to - /centers/:hash/gallery: ', ctx.body);

	},

	async delete(ctx){
		const {
			state: {
				user: {
					hash,
					role
				},
				lc,
				id
			}
		} = ctx;

		infoLog.info('Request to delete - /menu/courses/:hash/:id: ', ctx);

		if(lc.hash !== hash || role !== 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" doesn't belong to user with hash "${hash}"`);
		}
		
		const updatedLC = await LCService.pull(lc._id, id);

		ctx.body = { data: updatedLC };

		infoLog.info('Response to delete - /menu/courses/:hash/:id: ', ctx.body);

	}
}