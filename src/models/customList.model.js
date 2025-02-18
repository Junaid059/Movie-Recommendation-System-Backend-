import mongoose from 'mongoose';

const cutomListSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },

    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const CustomList = mongoose.model('CustomList', cutomListSchema);

export default CustomList;
