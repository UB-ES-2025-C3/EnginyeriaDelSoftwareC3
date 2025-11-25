import mongoose from 'mongoose';

const { Schema } = mongoose;

const reviewSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    text: { type: String, trim: true, maxlength: 500, default: '' }
  }, {timestamps: { createdAt: true, updatedAt: false }, versionKey: false});

export const Review = mongoose.model('Review', reviewSchema);
