import mongoose from 'mongoose';

const ReviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 0,
    },

    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
