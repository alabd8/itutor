import mongoose from 'mongoose';
import { isEmail } from 'validator';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt-nodejs';
import uuid from 'uuid/v4';

mongoose.plugin(uniqueValidator);

const LCSchema = new mongoose.Schema({
	name: {
		type: String,
		lowercase: true,
		required: 'Name is required',
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
		validate: [ /^[0-9+]{10,}$/, `Invalid phone number` ],
		required: 'Phone number is required',
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
		lowercase: true,
		default: false
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
		enum: ['center'],
		trim: true,
		lowercase: true
	},
	img: {
		type: Object
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
			trim: true
		},
		text: {
			type: String,
			required: `Comment is required`
		},
		starCount: {
			type: Number,
			default: 0
		}
	}],
	teachers: [{
		teacherLink: {
			type: String,
			required: `Teacher link is required`,
			trim: true
		},
		teacherName: {
			type: String,
			required: `Teacher name is required`,
			trim: true
		},
		teacherTags: {
			type: [String],
			required: `Teacher tags are required`,
			trim: true
		},
		teacherDescription: {
			type: String,
			required: `Teacher Description is required`,
			trim: true
		},
		reviews: {
			type: [Object]
		}
	}],
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
		default: false
	},
	saves: {
		type: [Object]
	},
	active: {
		type: [Object]
	},
	starCount: {
		type: Number,
		default: 0
	},
	hash: {
		type: String,
		unique: 'Hash must be unique'
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
});

LCSchema.statics.createFields = ['name', 'title', 'tags', 
								'description', 'skype', 'active',
								'comments', 'role', 'password',
								'email', 'saves', 'phone',
								'workingTime', 'address', 'ways',
								'reviews', 'teachers', 'course',
								'gallery', 'coords', 'recommended',
								'starCount', 'authorized'
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











