import pick from 'lodash/pick';

// import getTagsFromCotegories from '../helpers/getTagsFromCotegories';
import { infoLog } from '../../../utils/logs/logger';
import setCtx from '../../../helpers/setCtx';
import setParamsForImage from '../../../helpers/setParamsForImage';
import updatingUser from '../../../helpers/updatingUser';

import { User } from '../../users';
import { UserService } from '../../users/services';


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

	async getLC(ctx){
		const {
			state: {
				user: {
					role,
					hash
				},
				lc
			}
		} = ctx;

		infoLog.info('Request to - /menu/courses/:hash: ', ctx);
		
		if(lc.hash != hash || role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" 
							doesn't belong to user with hash "${hash}"`);
		}

		const result = await UserService.findOne({ hash: lc.hash });

		await setCtx(ctx, { data: result });
		
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
			ctx.throw(403, 
				`Forbidden. Learning Centre with hash "${lc.hash}"
			 	doesn't belong to user with hash "${hash}"`);
		}

		await UserService.updateOne(id, body);
		const updatedLC = await UserService.findOne({ _id: lc._id });

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

		infoLog.info('Request to - /menu/:hash/contacts & /menu/:hash/settings: ', ctx);

		if(lc.hash != hash || role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" 
							doesn't belong to user with hash "${hash}"`);
		}
		const newData = pick(body, User.createFields);

		if(newData.role !== 'center'){
			throw new AppError({ status: 400, message: `Error on updating "role"` });			
		}
		let img = await setParamsForImage(ctx);			  

		await updatingUser(img, newData, lc, ctx);

		infoLog.info('Response to - /menu/:hash/contacts & /menu/:hash/settings: ', ctx.body);
	},

	async create(ctx){
		const {
			state: {
				user: {
					role,
					hash
				},
				lc
			},
			request: { body }
		} = ctx;

		infoLog.info('Request to - /menu/courses/:hash/new-course: ', ctx);

		if(lc.hash != hash || role != 'center'){
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}"
							 doesn't belong to user with hash "${hash}"`);
		}


		const result = await UserService.push(lc._id, body);

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
			const result = await UserService.findOne({ hash: lc.hash });

			await setCtx(ctx, [{ "Instance User is ": user }, 
							   { "Instance LC is ": result }, 
							   { "Courses": result.page.course }]);	
		}catch(ex){
			ctx.throw(400, { 
				message: `Error. Can not get courses` 
			});	
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
			const result = await UserService.findOne({ hash: lc.hash });
			let set = [];

			for(let i = 0; i <= result.page.course.length; i++){
				if(result.page.course[i]){
					if(result.page.course[i]._id == id){
						set.push(result.page.course[i]);
					}
				}
			}

			await setCtx(ctx, [{ "Instance User is ": user }, 
							   { "Instance LC is ": result }, 
							   { "Course ": set }]); 
		}catch(ex){
			ctx.throw(400, { 
				message: 	`Error. Can not get course` 
			});
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
			const result = await UserService.findOne({ hash: lc.hash });

			await setCtx(ctx, [{ "Instance User is ": user }, 
							   { "Instance LC is ": result }, 
							   { "Teachers ": result.teachers }]);	
		}catch(ex){
			ctx.throw(400, { 
				message: 	`Error. Can not get teachers` 
			});
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
			const result = await UserService.findOne({ hash: lc.hash });
			let set = [];
			
			for(let i = 0; i <= result.teachers.length; i++){
				if(result.teachers[i]){
					if(result.teachers[i]._id == id){
						set.push(result.teachers[i]);
					}
				}
			}

			await setCtx(ctx, [{ "Instance User is ": user }, 
							   { "Instance LC is ": result }, 
							   { "Teacher: ": set }]);	
		}catch(ex){
			ctx.throw(400, { 
				message: 	`Error. Can not get teacher` 
			});
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
			const result = await UserService.findOne({ hash: lc.hash });

			await setCtx(ctx, [{ "Instance User is ": user }, 
							   { "Instance LC is ": result }, 
							   { "Gallery ": result.gallery }]);
		}catch(ex){
			ctx.throw(400, { 
				message: 	`Error. Can not get gallery` 
			});
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
			ctx.throw(403, `Forbidden. Learning Centre with hash "${lc.hash}" 
							doesn't belong to user with hash "${hash}"`);
		}
		
		const updatedLC = await UserService.pull(lc._id, id);

		ctx.body = { data: updatedLC };

		infoLog.info('Response to delete - /menu/courses/:hash/:id: ', ctx.body);

	},

	async deleteLC(ctx){
		const { 
			state: { 
				user: {
					role,
					hash
				},
				lc
			}
		} = ctx;

		infoLog.info('Request to delete - /tutor/:hash: ', ctx);
		
		if(lc.hash != hash || role != 'center'){
			ctx.throw(403, `Forbidden. Tutor with hash ${lc.hash} 
							does not belong to user with hash ${hash}`);
		}

		await lc.remove();

		await setCtx(ctx, { hash: lc.hash });

		infoLog.info('Response to delete - /tutor/:hash: ', ctx.body);

	}
}