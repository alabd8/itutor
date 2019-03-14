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
	},
	uniqueID: {
		type: Number,
		default: null
	},
	params: {
		create_time: {
			type: Number,
			default: null
		},
		state: {
			type: Number,
			default: 0,
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
			type: String,	
			default: null
		},
		amount: {
			type: Number,
			default: 0
		},
		time_pay: {
			type: Number,
			default: null
		},
		payme_id: {
			type: String,
			default: null
		},
		time_end: {
			type: Number,
			default: null
		}
	},
}, { 
    timestamps: true
});
 
PaymentSchema.statics.createFields = [ 'uniqueID', 'params' ];

PaymentSchema.pre('save', function(next){
	if(!this.hash){
		this.hash = uuid();
	}

	next();
});

export default mongoose.model('payment', PaymentSchema);
