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

		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const result = await TutorService.findOne(tutor);

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

		if(tutor.hash != hash || role != 'tutor'){
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

		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const newData = pick(body, Tutor.createFields);
			  let img = await setParamsForImage(ctx);
			  
			  if(img == false){ 
					const updatedTutor = await TutorService.updateTutor(newData, tutor);
					ctx.body = { data: updatedLC };
			  }else{
					newData.img = img;
			  		const updatedTutor = await TutorService.updateTutor(newData, tutor);
					ctx.body = { data: updatedLC };
			  }

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

		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const result = await TutorService.push(tutor._id, ctx.request.body);

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

		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash "${tutor.hash}" doesn't belong to user with hash "${hash}"`);
		}

		const updatedTutor = await TutorService.pull(tutor._id, id);

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
			const result = await TutorService.findOne(tutor);

			await setCtx(ctx, [{ user: user }, { tutor: result }, { tutor_courses: result.course }]);	
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
			const result = await TutorService.findOne(tutor);

			await setCtx(ctx, [{ user: user }, { tutor: result }, { gallery: result.gallery }]);
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

		if(tutor.hash != hash || role != 'tutor'){
			ctx.throw(403, `Forbidden. Tutor with hash ${tutor.hash} does not belong to user with hash ${hash}`);
		}

		await tutor.remove();

		await setCtx(ctx, { hash: tutor.hash });
	},
};

