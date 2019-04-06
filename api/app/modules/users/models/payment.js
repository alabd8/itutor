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
		id: {
			type: String,
			default: new mongoose.Types.ObjectId()
		},
		amount: {
			type: Number,
			default: 0,
		},
		account: {
			itutor: {
				type: String,
				default: null
			}
		},
		time: {
			type: Number,
			default: 0
		},
		create_time: {
			type: Number,
			default: 0
		},
		state: {
			type: Number,
			default: 0,
		},
		transaction: {
			type: String,
			default: null
		},
		perform_time: {
			type: Number,
			default: 0
		},
		cancel_time: {
			type: Number,
			default: 0
		},
		reason: {
			type: Number,	
			default: null
		},
	},
	mock_amount: {
		type: Number,
		default: 0
	}, 
	amount: {
		type: Number,
		default: 0
	},
	time_out: {
		type: Number,
		default: null,
	},
	payment_time: {
		type: Number,
		default: null
	},
	payment_unique_id: {
		type: Number,
		default: 0
	},
	payment_id: {
		type: String,
		default: null
	},
	expires30d: {
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
	
	if(!this.time_out) 	this.time_out = Date.now() + 12*1000*60*60;

	if(!this.expires30d){
		const THIRTY_DAYS = (30 * 24 * 60 * 60 * 1000);
			// const THIRTY_DAYS = 200000;

		this.expires30d = Date.now() + THIRTY_DAYS;
	}

	if(!this.params.transaction)  this.params.transaction = `${Math.ceil(Math.random() * 9999)}`;

	if(!this.params.account.itutor)  this.params.account.itutor = this.id;
	next();
});

export default mongoose.model('payment', PaymentSchema);
