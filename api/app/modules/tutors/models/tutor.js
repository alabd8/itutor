import mongoose, { Schema } from 'mongoose';
import { isEmail } from 'validator';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';

mongoose.plugin(uniqueValidator);

const TutorSchema = new Schema({
	name: {
		type: String,
		lowercase: true,
		trim: true
	},
	firstName: {
		type: String,
		lowercase: true,
		required: 'First name is required',
		trim: true
	},
	lastName: {
		type: String,
		lowercase: true,
		required: 'Last name is required',
		trim: true
	},
	title: {
		languages: [{
			title: {
				type: [String],
			},
			tags: {
				type: [String]
			},	
		}],
		sciences: [{
			title: {
				type: [String],
			},
			tags: {
				type: [String]
			},
		}],
		information: [{
			title: {
				type: [String],
			},
			tags: {
				type: [String]
			},
		}],
		prof: [{
			title: {
				type: [String],
			},
			tags: {
				type: [String]
			},
		}],
		extra: [{
			title: {
				type: [String],
			},
			tags: {
				type: [String]
			},
		}],
		сreative: [{
			title: {
				type: [String],
			},
			tags: {
				type: [String]
			},
		}],
		combined: [{
			title: {
				type: [String],
			},
			tags: {
				type: [String]
			},	
		}],
		unpaid: [{
			title: {
				type: [String],
			},
			tags: {
				type: [String]
			},
		}],
	},
	tags: {
		type: [String],
		trim: true,
		required: 'Tags are required'
	},
	phone: {
		type: [String],
		required: 'Phone number is required',
		validate: [ /^[0-9+]{10,}$/, `Invalid phone number` ],
		trim: true,
	},
	email: {
		type: String,
		unique: 'Email with "{VALUE}" already exist',
		lowercase: true,
		validate: [ isEmail, `Invalid Email '{VALUE}'` ],
		required: 'Email is required',
		trim: true,
	},
	password: {
		type: String,
		validate: [ /^[a-zA-Z0-9@_-]{8,32}$/, `Password character must contain the following 'a-zA-Z0-9@_-'` ],
		required: 'Password is required',
		trim: true,
	},
	description: {
		type: String,
		lowercase: true
	},
	workingTime: {
		type: [String],
	},
	address: {
		type: String,
		trim: true
	},
	ways: {
		type: [String],
		trim: true
	},
	role: {
		type: String,
		required: 'Role is required',
		enum: ['tutor'],
		trim: true,
		lowercase: true
	},
	img: {
		type: Object,
	},
	recommended: {
		type: Boolean,
		default: false,
	},
	hash: {
		type: String,
		unique: 'Hash must be unique'
	},
	history: [{
		companyName: {
			type: String,
			required: 'Company name is required',
			trim: true,
		},
		title: {
			type: String,
			required: 'Title is required',
			trim: true,
		},
		date: {
			start: {
				type: Date,
				required: 'Start date is required',
			},
			end: {
				type: Date
			},
		},
		current: {
			type: Boolean,
			default: false,
		},
		description: {
			type: String,
			required: 'Desription is required',
			trim: true,
		},
	}],
	saves: {
		type: [Object],
	},
	active: {
		type: [Object],
	},
	coords: {
		lat: {
			type: String
		},
		long: {
			type: String
		}
	},
	state: {
		type: Boolean,
		default: false,
	},
	starCount: {
		type: Number,
		default: 0,
	},
	course: {
		type: Object,
	},
	gellery: {
		type: Object,
	},
	trophies: {
		type: Object,
	},
	url: {
		type: String,
	}
}, {
	timestamps: true
	// , toJSON: { virtuals: true }
});

TutorSchema.statics.createFields = [
						'firstName', 'lastName', 'title', 
						'tags', 'phone', 'email', 'password', 
						'workingTime', 'description', 'address', 
						'catchBuses', 'history', 'role',
						'saves', 'active', 'coords', 'state', 
						'starCount', 'course', 'gellery', 'trophies',
						'recommended'
						];

TutorSchema.pre('save', function(next){
	if(this.isModified('password')){
		let salt = bcrypt.genSaltSync(10);

		this.password = bcrypt.hashSync(this.password, salt);
	}

	if(!this.hash){
		this.hash = uuid();
	}

	if(!this.url){
		this.url = `tutors/${this.hash}`;
	}

	next();
});


// TutorSchema.virtual('tutor', {
// 	ref: 'tutor',
// 	localField: 'hash',
// 	foreignField: 'tutorHash',
// 	justOne: true,
// });

TutorSchema.methods.comparePasswords = function(password){
	return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('tutor', TutorSchema);
