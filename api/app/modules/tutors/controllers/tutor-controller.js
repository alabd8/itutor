import pick from 'lodash/pick';
import { Tutor } from '../models';
import setParamsForImage from '../../../helpers/setParamsForImage';
import checkEnumValues from '../../../helpers/checkEnumValues';
import setCtx from '../../../helpers/setCtx';
import { TutorService } from '../services';

export default {
	async signup(ctx){
		const tutorData = pick(ctx.request.body, Tutor.createFields);
			  tutorData.img = await setParamsForImage(ctx);
		
		await checkEnumValues(ctx);

		const { _id } = await TutorService.createTutor(tutorData);
		const tutor = await TutorService.findOne(_id);

		await setCtx(ctx, tutor);
	},

	async getTutor(ctx){
		const {
			state: {
				user: {
					role,
					hash,
				},
				tutor,
			}
		} = ctx;

		if(user.role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const result = await TutorService.findOne(user);

		await setCtx(ctx, { data: result });
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
				tutor,
				id,
			},
		} = ctx;

		if(tutor.hash != hash && role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const pull = await TutorService.pull(tutor._id, id);
		const updatedTutor = await TutorService.push(tutor._id, ctx.request.body);

		await setCtx(ctx, { data: updatedTutor });
	},

	async updateTutor(ctx){
		const {
			request: {     
				body,
			},
			state: {
				user: {
					role,
					hash,
				},
				tutor,
			},
		} = ctx;

		if(tutor.hash != hash && role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const newData = pick(body, Tutor.createFields);
		const updatedTutor = await TutorService.updateTutor(newData, tutor);

		ctx.body = { data: updatedLC };
	},

	async create(ctx){
		const {
			state: {
				user: {
					role,
					hash,
				},
				tutor,
			}
		} = ctx;

		if(tutor.hash != hash && role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const result = await LCService.push(tutor._id, ctx.request.body);

		ctx.status = 201;
		ctx.body = { data: result };
	},

	async delete(ctx){
		const {
			state: {
				user: {
					hash,
					role,
				},
				tutor,
				id,
			},
		} = ctx;

		if(tutor.hash !== hash && role !== 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const updatedTutor = await LCService.pull(tutor._id, id);

		ctx.body = { data: updatedTutor };
	},

	async showCourses(ctx){
		const {
			state: {
				user,
				tutor,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		try{
			const result = await TutorService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { tutor_courses: result.course }]);	
		}catch(ex){
			ctx.throw(400, { message: `Error. Can not get courses` });	
		}
	},

	async showCourse(ctx){
		const {
			state: {
				user,
				tutor,
				id,
			},
			request: {
				body: {
					state,
				}
			}
		} = ctx;

		try{
			const course = await TutorService.findOne(id);
			const result = await TutorService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { tutor: result }, { course: course }]); 
		}catch(ex){
			ctx.throw(400, { message: 	`Error. Can not get course` });
		}
	},

	async gallery(ctx){
		const {
			state: {
				user,
				tutor,
			},
			request: {
				body: {
					data,
				}
			}
		} = ctx;

		try{
			const result = await TutorService.findOne(lc);

			await setCtx(ctx, [{ user: user }, { tutor: tutor }, { gallery: result.gallery }]);
		}catch(ex){
			ctx.throw(400, { message: 	`Error. Can not get gallery` });
		}
	},

	async deleteTutor(ctx){
		const { 
			state: { 
				user: {
					role,
					hash,
				},
				tutor,
			}
		} = ctx;

		if(tutor.hash != hash && role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash ${tutor.hash} does not belong to user with hash ${hash}`);
		}

		await tutor.remove();

		await setCtx(ctx, { hash: tutor.hash });
	},
};

