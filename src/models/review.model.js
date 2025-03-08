import mongoose from 'mongoose';

const ReviewSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Making user field required
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true, // Making movie field required
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      minlength: 5,
    },
  },
  { timestamps: true }
);

const Review = mongoose.model('Review', ReviewSchema);

export default Review;
