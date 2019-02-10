import mongoose from 'mongoose';
import { isEmail } from 'validator';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt-nodejs';
import uuid from 'uuid/v4';

mongoose.plugin(uniqueValidator);

const TutorSchema = new mongoose.Schema({
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
				type: [String]
			},
			tags: {
				type: [String]
			},
			_id: {
				type: mongoose.Schema.Types.ObjectId 
			}	
		}],
		sciences: [{
			title: {
				type: [String]
			},
			tags: {
				type: [String]
			},
			_id: {
				type: mongoose.Schema.Types.ObjectId 
			}	
		}],
		information: [{
			title: {
				type: [String]
			},
			tags: {
				type: [String]
			},
			_id: {
				type: mongoose.Schema.Types.ObjectId 
			}
		}],
		prof: [{
			title: {
				type: [String]
			},
			tags: {
				type: [String]
			},
			_id: {
				type: mongoose.Schema.Types.ObjectId 
			}
		}],
		extra: [{
			title: {
				type: [String]
			},
			tags: {
				type: [String]
			},
			_id: {
				type: mongoose.Schema.Types.ObjectId 
			}
		}],
		сreative: [{
			title: {
				type: [String]
			},
			tags: {
				type: [String]
			},
			_id: {
				type: mongoose.Schema.Types.ObjectId 
			}
		}],
		combined: [{
			title: {
				type: [String]
			},
			tags: {
				type: [String]
			},
			_id: {
				type: mongoose.Schema.Types.ObjectId 
			}	
		}],
		unpaid: [{
			title: {
				type: [String]
			},
			tags: {
				type: [String]
			},
			_id: {
				type: mongoose.Schema.Types.ObjectId 
			}
		}]
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
		trim: true
	},
	email: {
		type: String,
		unique: 'Email with "{VALUE}" already exist',
		lowercase: true,
		validate: [ isEmail, `Invalid Email '{VALUE}'` ],
		required: 'Email is required',
		trim: true
	},
	password: {
		type: String,
		validate: [ /^[a-zA-Z0-9@_-]{8,32}$/, `Password character must contain the following 'a-zA-Z0-9@_-'` ],
		required: 'Password is required',
		trim: true
	},
	description: {
		type: String,
		lowercase: true
	},
	workingTime: {
		type: [String]
	},
	address: {
		type: String,
		trim: true,
		default: false
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
		type: Object
	},
	recommended: {
		type: Boolean,
		default: false
	},
	hash: {
		type: String,
		unique: 'Hash must be unique'
	},
	history: [{
		companyName: {
			type: String,
			required: 'Company name is required',
			trim: true
		},
		title: {
			type: String,
			required: 'Title is required',
			trim: true
		},
		date: {
			start: {
				type: Date,
				required: 'Start date is required'
			},
			end: {
				type: Date
			}
		},
		current: {
			type: Boolean,
			default: false
		},
		description: {
			type: String,
			required: 'Desription is required',
			trim: true
		}
	}],
	saves: {
		type: [Object]
	},
	active: {
		type: [Object]
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
	state: {
		type: Boolean,
		default: false
	},
	starCount: {
		type: Number,
		default: 0
	},
	course: [{
		name: {
			type: String,
			required: 'Name is required',
			trim: true
		},
		title: {
			type: String,
			required: 'Course title is required',
			trim: true
		},
		category: {
			type: String,
			required: 'Course category is required',
			trim: true
		},
		tags: {
			type: [String],
			required: 'Course tags are required',
			trim: true
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
		state: {
			type: Boolean,
			default: false
		},
		starCount: {
			type: Number,
			default: 0
		},
		sticker: {
			type: String,
			default: false
		},
		link: {
			type: String,
			default: false
		},
		addInfo: {
			type: String,
			default: false
		},
		logoUrl: {
			type: String,
			default: false
		},
		introText: {
			type: String,
			default: false
		},
		coursePage: {
			teacherId: {
				type: String,
				default: false
			},
			teacherInfo: {
				type: String,
				default: false
			},
			title: {
				type: String,
				default: false
			},
			about: {
				type: String,
				default: false
			},
			courseType: {
				type: String,
				default: false
			}
		}
	}],
	gallery: {
		type: Object,
		default: false
	},
	trophies: {
		type: Object,
		default: false
	},
	url: {
		type: String
	},
	authorized: {
		type: Boolean,
		default: false
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
						'starCount', 'course', 'gallery', 'trophies',
						'recommended', 'authorized'
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
