import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: String,
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const BookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
  },
  author: {
    type: String,
    required: [true, 'Please provide an author'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['Fiction', 'Non-Fiction', 'Science', 'History', 'Self-help', 'Education', 'Academic', 'Literature'],
  },
  coverImage: {
    type: String,
    required: [true, 'Please provide a cover image URL'],
  },
  pdfUrl: {
    type: String,
    required: [true, 'Please provide a PDF URL'],
  },
  isPremium: {
    type: Boolean,
    default: false,
  },
  views: {
    type: Number,
    default: 0,
  },
  reviews: [ReviewSchema],
  averageRating: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model('Book', BookSchema);
