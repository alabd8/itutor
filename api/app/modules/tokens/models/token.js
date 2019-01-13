import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
    email: {
        type: String
    },
    token: {
        type: String,
        unique: 'Refresh Token must be unique'
    }
});

export default mongoose.model('token', TokenSchema);