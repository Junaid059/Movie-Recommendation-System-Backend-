import mongoose from 'mongoose';

const recommendationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },
  },
  { timestamps: true }
);

const Recommendation = mongoose.model('Recommendation', recommendationSchema);

export default Recommendation;
