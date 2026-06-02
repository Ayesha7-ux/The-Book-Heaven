import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    select: false, // Don't return password by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  recentlyRead: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
  savedBooks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
    },
  ],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
