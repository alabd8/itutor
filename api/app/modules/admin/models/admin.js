import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import { isEmail } from 'validator';
import uuid from 'uuid/v4';

mongoose.plugin(uniqueValidator);

const AdminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: 'Email is required',
		validate: [ isEmail, `Invalid Email '{VALUE}'` ],
		lowercase: true,
		trim: true,
		unique: 'User email with "{VALUE}" already exist'
	},
	password: {
		type: String,
		required: 'Password is required',
		trim: true
	},
	role: {
		type: Number
	},
	hash: {
		type: String,
		unique: 'Hash must be unique'
	}
});


AdminSchema.statics.createFields = ['email', 'password'];

AdminSchema.pre('save', function(next){
	if(!this.hash){
		this.hash = uuid();
	}

	next();
});


export default mongoose.model('admin', AdminSchema);