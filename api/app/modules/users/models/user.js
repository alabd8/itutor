import mongoose from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt-nodejs';
import uniqueValidator from 'mongoose-unique-validator';
import uuid from 'uuid/v4';

mongoose.plugin(uniqueValidator);

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		trim: true
	},
	firstName: {
		type: String,
		trim: true,
		required: 'First name is required'
	},
	lastName: {
		type: String,
		trim: true,
		required: 'Last name is required'
	},
	phone: [{
		type: String,
		validate: [ /^[0-9+]{10,}$/, `Invalid phone number`],
		required: 'Phone number is required',
		trim: true
	}],
	email: {
		type: String,
		unique: 'User email with "{VALUE}" already exist',
		lowercase: true,
		validate: [ isEmail, `Invalid Email '{VALUE}'` ],
		required: 'Email is required', 
		trim: true
	},
	password: {
		type: String,
		validate: [ /^[a-zA-Z0-9@_-]{8,32}$/, `Password must contain the following "[a-zA-Z0-9@_-]"`],
		required: 'Password is required',
		trim: true
	},
	role: {
		type: String,
		required: 'Role is required',
		enum: ['student', 'tutor', 'center', 'moderator', 'admin'],
		trim: true,
		lowercase: true
	},
	img: {
		type: Object
	},
	saves: [{
		type: String,
	}],
	active: [{
		type: String,
	}],
	hash: {
		type: String,
		unique: 'Hash must be unique'
	},
	page: {
		link: {
			type: String,
		},
		linkFull: {
			type: String,
		},
		name: { 
			type: String,
		},
		img: {
			type: Object,
			default: null
		},
		stars: {
			type: Number,
			default: 0
		},
		info: {
			type: String,
		},
		content: {
			type: String,
		},
		description: {
			type: String,
		},
		phone: [{
			type: String,
			validate: [ /^[0-9+]{10,}$/, `Invalid phone number`],
			required: 'Phone number is required',
			trim: true,
		}],
		workingTime: {
			type: String,
		},
		place: {
			type: String,
		},
		address: {
			type: String,
		},
		ways: {
			type: String,
			default: null
		},
		reviews: [{
			img: {
				type: Object,
				default: null
			},
			name: {
				type: String,
				required: `Name is required`,
				trim: true,
				default: null
			},
			info: {
				type: String,
				default: null
			},
			comment: {
				type: String,
				required: `Comment is required`
			},
			stars: {
				type: Number,
				default: 0
			}
		}],
		course: [{
			title: {
				type: String,
				required: 'Course title is required',
				default: null
			},
			category: {
				type: String,
				required: 'Course category is required',
				default: null
			},
			tags: {
				type: [ String ],
				trim: true,
				default: null
			},
			coords: {
				lat: {
					type: String,
					default: null
				},
				long: {
					type: String,
					default: null
				}
			},
			state: {
				type: Boolean,
				default: false
			},
			stars: {
				type: Number,
				default: 0
			},
			sticker: {
				type: String,
				default: null
			},
			link: {
				type: String,
				default: false
			},
			info: {
				type: String,
				default: null
			},
			img: {
				type: String,
				default: null
			},
			introText: {
				type: String,
				default: null
			},
			coursePage: {
				teacherHash: {
					type: String,
					default: null
				},
				teacherLink: {
					type: String,
					default: null
				},
				teacherName: {
					type: String,
					default: null
				},
				teacherCourses: {
					type: [ String ],
					default: null
				},
				title: {
					type: String,
					default: null
				},
				description: {
					type: String,
					default: null
				},
				type: {
					type: [ String ],
					default: null
				},
				time: {
					type: String,
					default: null
				},
				count: {
					type: String,
					default: null
				},
			},
		}],
	},
	gallery: {
		link: {
			type: String,
			default: null
		},
		images: [{
			url: {
				type: String,
				default: null
			},
			text: {
				type: String,
				default: null
			},
		}],
	},
	trophies: {
		type: Object,
		default: false
	},
	recommended: {
		type: Boolean,
		default: false
	},
	teachers: [{
		teacherName: {
			type: String,
			default: null,
		},
		teacherCourses: [{
			type: String,
			default: null
		}],
		teacherInfo: {
			type: String,
			default: null
		},
		teacherDescription: {
			type: String,
			default: null
		},
		reviews: [{
			img: {
				type: Object,
				default: null
			},
			name: {
				type: String,
				required: `Name is required`,
				trim: true,
				default: null
			},
			info: {
				type: String,
				default: null
			},
			comment: {
				type: String,
				required: `Comment is required`
			},
			stars: {
				type: Number,
				default: 0
			}
		}],
	}],
	uniqueID: {
		type: Number
	},
	time_end: {
		type: Number,
		default: null
	},
	pay_state: {
		type: Number,
		default: 0
	},
	amount: {
		type: Number,
		default: 0
	},
	state: {
		type: Boolean,
		default: false
	},
	code: {
		type: String,
		default: null
	},
	verified: {
		type: Boolean,
		default: false
	},
	requests: [{
		email: {
			type: String,
			default: null
		},
		title: {
			type: String,
			default: null
		},
		stars: {
			type: String,
			default: null
		}
	}]
}, { timestamps: true });
 
UserSchema.statics.createFields = [
						'name', 'firstName', 'lastName','email', 'password', 'role', 
						'saves', 'active', 'phone', 'img', 'page', 'gallery', 'state',
						'trophies', 'recommended', 'teachers', 'params', 'uniqueID', 'code'
					];

UserSchema.statics.createFieldsForStudent = [
						'name', 'firstName', 'lastName','email', 'password', 'role', 
									'saves', 'active', 'phone', 'img',
					];
// UserSchema.virtual('payment', {
// 	ref: 'payment',
// 	localField: 'hash',
// 	foreignField: 'userHash',
// 	justOne: true,
// });

UserSchema.pre('save', function(next){
	if (this.isModified('password')) {
		const salt = bcrypt.genSaltSync(10);
	
		this.password = bcrypt.hashSync(this.password, salt);
	}
	
	if(!this.hash) this.hash = uuid();
	
	if(this.role !== 'moderator') this.requests = null;

	if(this.role != 'center') this.teachers = null;
	
	if(this.role === 'center' ||  this.role === 'tutor'){
		if(!this.page.link) this.page.link = this._id;

		if(!this.page.linkFull) this.page.linkFull = `${this.role}s/${this._id}`;

		if(!this.page.course.link) 
			this.page.course.link = `${this.role}s/${this._id}/courses/${this.page.course._id}` ;

		if(!this.gallery.link) this.gallery.link = `${this.role}s/${this._id}/gallery`;

		if(!this.url) this.url = `users/${this.hash}`;

	}else{
		this.page = null;
		this.gallery = null;
		this.params = null;
	}
	
	next();
});

UserSchema.methods.comparePasswords = function(password){
	return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('user', UserSchema);
