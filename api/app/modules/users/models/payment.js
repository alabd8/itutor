import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import uuid from 'uuid/v4';

mongoose.plugin(uniqueValidator);

const PaymentSchema = new mongoose.Schema({
	userHash: {
		type: String,
	},
	hash: {
		type: String,
		unique: 'Hash must be unique'
	},
	params: {
		create_time: {
			type: Number,
			default: null
		},
		state: {
			type: Number,
			default: -1,
		},
		transaction: {
			type: Number,
			default: 0
		},
		perform_time: {
			type: Number,
			default: null
		},
		cancel_time: {
			type: Number,
			default: null
		},
		reason: {
			type: Number,	
			default: null
		},
		amount: {
			type: Number,
			default: 0
		},
	},
	time_out: {
		type: Number,
		default: null,
	},
	payment_time: {
		type: Number,
		default: null
	},
	payment_id: {
		type: String,
		default: null
	},
	time_end: {
		type: Number,
		default: null
	},
	id: {
		type: String,
		default: null
	},
}, { 
    timestamps: true
});

PaymentSchema.pre('save', function(next){
	if(!this.hash)	 this.hash = uuid();	
	
	if(!this.time_out){
		this.time_out = Date.now() + 12*1000*60*60;
	}

	if(!this.time_end){
		const THIRTY_DAYS = (30 * 24 * 60 * 60 * 1000);
			// const THIRTY_DAYS = 200000;

		this.time_end = Date.now() + THIRTY_DAYS;
	}
	if(!this.params.transaction){
		this.params.transaction = Math.ceil(Math.random() * 9999);
	}

	next();
});

export default mongoose.model('payment', PaymentSchema);
