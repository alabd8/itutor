import pick from 'lodash/pick';

import { infoLog } from '../../../utils/logs/logger';
import setParamsForImage from '../../../helpers/setParamsForImage';
import setCtx from '../../../helpers/setCtx';
import updatingUser from '../../../helpers/updatingUser';

import { User } from '../../users';
import { UserService } from '../../users/services';

export default {
	async getTutor(ctx){
		const {
			state: {
				user: {
					role,
					hash
				},
				tutor
			}
		} = ctx;

		infoLog.info('Request to - /menu/teachers/:hash: ', ctx);

		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" 
							doesn't belong to user with hash "${hash}"`
			);
		}

		const result = await UserService.findOne({ hash: tutor.hash });

		await setCtx(ctx, { data: result });

		infoLog.info('Response to - /menu/teachers/:hash: ', ctx.body);
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
				tutor,
				id
			}
		} = ctx;

		infoLog.info('Request to - /menu/teachers/:hash/:id: ', ctx);

		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" 
							doesn't belong to user with hash "${hash}"`
			);
		}
		await UserService.updateOne(id, body);
		const updatedTutor = await UserService.findOne({ _id: tutor._id });

		await setCtx(ctx, { data: updatedTutor });

		infoLog.info('Response to - /menu/teachers/:hash/:id: ', ctx.body);
	},

	async updateTutor(ctx){
		const {
			request: {     
				body
			},
			state: {
				user: {
					role,
					hash
				},
				tutor
			}
		} = ctx;

		infoLog.info('Request to - /menu/:hash/contacts & /menu/:hash/settings: ', ctx);

		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" 
							doesn't belong to user with hash "${hash}"`);
		}

		const newData = pick(body, User.createFields);
		
		if(newData.role !== 'tutor'){
			throw new AppError({ status: 400, message: `Error on updating "role"` });			
		}
		
		let img = await setParamsForImage(ctx);			  
		
		await updatingUser(img, newData, tutor, ctx);

		infoLog.info('Response to - /menu/:hash/contacts & /menu/:hash/settings: ', ctx.body);
	},

	async create(ctx){
		const {
			request: {
				body
			},
			state: {
				user: {
					role,
					hash
				},
				tutor
			}
		} = ctx;

		infoLog.info('Request to - /menu/teachers/:hash/new-course: ', ctx);

		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const result = await UserService.push(tutor._id, body);

		ctx.status = 201;
		ctx.body = { data: result };

		infoLog.info('Response to - /menu/teachers/:hash/new-course: ', ctx.body);
	},

	async delete(ctx){
		const {
			state: {
				user: {
					hash,
					role
				},
				tutor,
				id
			}
		} = ctx;

		infoLog.info('Request to delete - /menu/teachers/:hash/:id: ', ctx);

		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" 
							doesn't belong to user with hash "${hash}"`);
		}

		const updatedTutor = await UserService.pull(tutor._id, id);

		ctx.body = { data: updatedTutor };

		infoLog.info('Response to delete - /menu/teachers/:hash/:id: ', ctx.body);
	},

	async showCourses(ctx){
		const {
			state: {
				user,
				tutor
			},
			request: {
				body: {
					data
				}
			}
		} = ctx;

		infoLog.info('Request to - /tutors/:hash/courses: ', ctx);

		try{
			const result = await UserService.findOne({ hash: tutor.hash });

			await setCtx(ctx, [{ "Instance User is ": user }, 
							   { "Instance Tutor is ": result }, 
							   { "Tutor Courses": result.page.course }]);	
		}catch(ex){
			ctx.throw(400, { message: `Error. Can not get courses` });	
		}

		infoLog.info('Response to - /tutors/:hash/courses: ', ctx.body);
	},

	async showCourse(ctx){
		const {
			state: {
				user,
				tutor,
				id
			},
			request: {
				body: {
					state
				}
			}
		} = ctx;

		infoLog.info('Request to - /tutors/:hash/courses/:id: ', ctx);
		
		try{
			const result = await UserService.findOne({ hash: tutor.hash });
			let set = [];

			for(let i = 0; i <= result.page.course.length; i++){
				if(result.page.course[i]){
					if(result.page.course[i]._id == id){
						set.push(result.page.course[i]);
					}
				}
			}

			await setCtx(ctx, [{ "Instance User is": user }, 
							   { "Instance Tutor is": result }, 
							   { "Course": set }]); 
		}catch(ex){
			ctx.throw(400, { message: 	`Error. Can not get course` });
		}

		infoLog.info('Response to - /tutors/:hash/courses/:id: ', ctx.body);
	},

	async gallery(ctx){
		const {
			state: {
				user,
				tutor
			},
			request: {
				body: {
					data
				}
			}
		} = ctx;

		infoLog.info('Request to - /tutors/:hash/gallery: ', ctx);

		try{
			const result = await UserService.findOne({ hash: tutor.hash });

			await setCtx(ctx, [{ "Instance User is": user }, 
							   { "Instance Tutor is": result }, 
							   { "Gallery": result.gallery }]);
		}catch(ex){
			ctx.throw(400, { message: 	`Error. Can not get gallery` });
		}

		infoLog.info('Response to - /tutors/:hash/gallery: ', ctx.body);
	},

	async deleteTutor(ctx){
		const { 
			state: { 
				user: {
					role,
					hash
				},
				tutor
			}
		} = ctx;

		infoLog.info('Request to delete - /tutor/:hash: ', ctx);
		
		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash ${tutor.hash} 
							does not belong to user with hash ${hash}`);
		}

		await tutor.remove();

		await setCtx(ctx, { hash: tutor.hash });

		infoLog.info('Response to delete - /tutor/:hash: ', ctx.body);
	}
};

