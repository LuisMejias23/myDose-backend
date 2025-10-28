import mongoose from 'mongoose';

const subscriptionSchema = new mongoose.Schema({
    endpoint: {
        type: String,
        required: true,
        unique: true // Para evitar duplicados en la DB
    },
    p256dh: {
        type: String,
        required: true
    },
    auth: {
        type: String,
        required: true
    },
   
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false 
    },
    createDate: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Subscription', subscriptionSchema);