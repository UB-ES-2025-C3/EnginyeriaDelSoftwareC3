import mongoose from 'mongoose';

// Subesquema simple para las reviews
const reviewSchema = new mongoose.Schema({
  stars: { type: Number, required: true, min: 1, max: 5 },
  text:  { type: String, trim: true, maxlength: 500, default: '' }
}, { _id: false });


const gameSchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true, minlength: 2, maxlength: 100, unique: true, index: true },
  genre:     { type: String, trim: true, maxlength: 50, default: '' },
  year:      { type: Number, min: 1970, max: new Date().getFullYear() },
  platform:  { type: String, trim: true, maxlength: 50, default: '' },
  image:     { type: String, trim: true, default: '' },
  reviews:   { type: [reviewSchema], default: [] }
}, { versionKey: false });

export const Game = mongoose.model('Game', gameSchema);
