import pick from 'lodash/pick';
import { Tutor } from '../models';
import setParamsForImage from '../../../helpers/setParamsForImage';
import { infoLog } from '../../../utils/logs/logger';
import checkEnumValues from '../../../helpers/checkEnumValues';
import setCtx from '../../../helpers/setCtx';
import { TutorService } from '../services';

export default {
	async signup(ctx){
		const tutorData = pick(ctx.request.body, Tutor.createFields);
			  tutorData.img = await setParamsForImage(ctx);
		
	 	infoLog.info('Request to - /menu/auth/signup/tutor: ', ctx);
		
		await checkEnumValues(ctx);

		const { _id } = await TutorService.createTutor(tutorData);
		const tutor = await TutorService.findOne(_id);

		await setCtx(ctx, tutor);

		infoLog.info('Response to - /menu/auth/signup/tutor: ', ctx.body);

	},

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
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const result = await TutorService.findOne(tutor);

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
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const pull = await TutorService.pull(tutor._id, id);
		const updatedTutor = await TutorService.push(tutor._id, ctx.request.body);

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
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const newData = pick(body, Tutor.createFields);
			  let img = await setParamsForImage(ctx);
			  
			  if(!img){ 
					const updatedTutor = await TutorService.updateTutor(newData, tutor);
					ctx.body = { data: updatedTutor };
			  }else{
					newData.img = img;
			  		const updatedTutor = await TutorService.updateTutor(newData, tutor);
					ctx.body = { data: updatedTutor };
			  }

		infoLog.info('Response to - /menu/:hash/contacts & /menu/:hash/settings: ', ctx.body);
		
	},

	async create(ctx){
		const {
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

		const result = await TutorService.push(tutor._id, ctx.request.body);

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
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const updatedTutor = await TutorService.pull(tutor._id, id);

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
			const result = await TutorService.findOne(tutor);

			await setCtx(ctx, [{ user: user }, { tutor: result }, { tutor_courses: result.course }]);	
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
			const result = await TutorService.findOne(tutor);
			let set = [];

			for(let i = 0; i <= result.course.length; i++){
				if(result.course[i]){
					if(result.course[i]._id == id){
						set.push(result.course[i]);
					}
				}
			}

			await setCtx(ctx, [{ user: user }, { tutor: result }, { course: set }]); 
		}catch(ex){
			console.log(ex);
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
			const result = await TutorService.findOne(tutor);

			await setCtx(ctx, [{ user: user }, { tutor: result }, { gallery: result.gallery }]);
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
			ctx.throw(403, `Forbidden. Tutor with hash ${tutor.hash} does not belong to user with hash ${hash}`);
		}

		await tutor.remove();

		await setCtx(ctx, { hash: tutor.hash });

		infoLog.info('Response to delete - /tutor/:hash: ', ctx.body);

	}
};

