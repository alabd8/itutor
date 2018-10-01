import mongoose, { Schema } from 'mongoose';
import { isEmail } from 'validator';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import uuid from 'uuid/v4';

mongoose.plugin(uniqueValidator);

const LCSchema = new Schema({
	name: {
		type: String,
		lowercase: true,
		required: 'Name is required',
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
		validate: [ /^[0-9+]{10,}$/, `Invalid phone number` ],
		required: 'Phone number is required',
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
		enum: ['center'],
		trim: true,
		lowercase: true
	},
	img: {
		type: Object,
	},
	reviews: [{
		name: {
			type: String,
			required: `Name is required`,
			trim: true
		},
		role: {
			type: String,
			required: `Role is required`,
			trim: true,
		},
		text: {
			type: String,
			required: `Comment is required`,
		},
		starCount: {
			type: Number,
			default: 0,
		},
	}],
	teachers: [{
		teacherLink: {
			type: String,
			required: `Teacher link is required`,
			trim: true,
		},
		teacherName: {
			type: String,
			required: `Teacher name is required`,
			trim: true,
		},
		teacherTags: {
			type: [String],
			required: `Teacher tags are required`,
			trim: true,
		},
		teacherDescription: {
			type: String,
			required: `Teacher Description is required`,
			trim: true,
		},
		reviews: {
			type: [Object],
		},
	}],
	course: {
		type: [Object]
	},
	gallery: {
		type: Object,
	},
	coords: {
		lat: {
			type: String,
			default: false
		},
		long: {
			type: String,
			default: false
		}
	},
	recommended: {
		type: Boolean,
		default: false,
	},
	saves: {
		type: [Object],
	},
	active: {
		type: [Object],
	},
	starCount: {
		type: Number,
		default: 0,
	},
	hash: {
		type: String,
		unique: 'Hash must be unique'
	},
	url: {
		type: String,
	}
}, {
	timestamps: true
});

LCSchema.statics.createFields = ['name', 'title', 'tags', 
								'description', 'skype', 'active',
								'comments', 'role', 'password',
								'email', 'saves', 'phone',
								'workingTime', 'address', 'ways',
								'reviews', 'teachers', 'course',
								'gallery', 'coords', 'recommended',
								'starCount'
								];

LCSchema.pre('save', function(next){
	if(this.isModified('password')){
		let salt = bcrypt.genSaltSync(10);

		this.password = bcrypt.hashSync(this.password, salt);
	}

	if(!this.hash){
		this.hash = uuid();
	}

	if(!this.url){
		this.url = `centers/${this.hash}`;
	}

	next();
});

LCSchema.methods.comparePasswords = function(password){
	return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('lc', LCSchema);











