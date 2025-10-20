import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },

  bio: { type: String, maxlength: 250, trim: true, default: '' },
  avatarUrl: { type: String, trim: true, default: '' },
  bannerUrl: { type: String, trim: true, default: '' },
  links: {
    type: {
      steam: { type: String, trim: true, default: '' },
      psn: { type: String, trim: true, default: '' },
      xbox: { type: String, trim: true, default: '' },
      nintendo: { type: String, trim: true, default: '' },
      twitch: { type: String, trim: true, default: '' },
      youtube: { type: String, trim: true, default: '' }
    },
    default: {} // L'objecte 'links' per defecte estarà buit
  }

}, { versionKey: false });

userSchema.index({ email: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
