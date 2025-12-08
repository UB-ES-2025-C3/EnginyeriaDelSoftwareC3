import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        trim: true,
        maxlength: 500
    },
    videoUrl: {
        type: String,
        trim: true,
        default: null
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    comments: [{
        text: { type: String, required: true, trim: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        createdAt: { type: Date, default: Date.now }
    }]
});

export const Post = mongoose.model('Post', postSchema);
