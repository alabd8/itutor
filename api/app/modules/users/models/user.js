import mongoose from 'mongoose';
import { isEmail } from 'validator';
import bcrypt from 'bcrypt';
import uniqueValidator from 'mongoose-unique-validator';
import uuid from 'uuid/v4';

mongoose.plugin(uniqueValidator);

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		lowercase: true,
		trim: true
	},
	firstName: {
		type: String,
		lowercase: true,
		trim: true,
		required: 'First name is required'
	},
	lastName: {
		type: String,
		lowercase: true,
		trim: true,
		required: 'Last name is required'
	},
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
		validate: [ /^[a-zA-Z0-9@_-]{8,32}$/, `Password character must contain the following 'a-zA-Z0-9@_-'` ],
		required: 'Password is required',
		trim: true
	},
	phone: {
		type: [String],
		validate: [ /^[0-9+]{10,}$/, `Invalid phone number`],
		required: 'Phone number is required',
		trim: true
	},
	role: {
		type: String,
		required: 'Role is required',
		enum: ['student'],
		trim: true,
		lowercase: true
	},
	saves: {
		type: [Object]
	},
	active: {
		type: [Object]
	},
	img: {
		type: Object
	},
	hash: {
		type: String,
		unique: 'Hash must be unique'
	},
	url: {
		type: String
	}
}, {
	timestamps: true
});
 
UserSchema.statics.createFields = ['firstName', 'lastName', 'email', 'password', 'role', 'saves', 'active', 'phone'];

UserSchema.pre('save', function(next){
	if(this.isModified('password')){
		let salt = bcrypt.genSaltSync(10);

		this.password = bcrypt.hashSync(this.password, salt);
	}

	if(!this.hash){
		this.hash = uuid();
	}

	if(!this.url){
		this.url = `users/${this.hash}`;
	}

	next();
});

UserSchema.methods.comparePasswords = function(password){
	return bcrypt.compareSync(password, this.password);
};

export default mongoose.model('user', UserSchema);
