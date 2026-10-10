import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    operation: {
        type: String,
        required: true,
        enum: ['+', '-', '*', '/']
    },
    numbers: {
        type: [Number],
        required: true
    },
    expression: {
        type: String,
        required: true
    },
    result: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: 'ok'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

export const History = mongoose.model('History', historySchema);
