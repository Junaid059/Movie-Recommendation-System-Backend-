import mongoose, { Schema } from 'mongoose';

const MovieSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },

    description: {
      type: String,
      requires: true,
      lowercase: true,
      unique: true,
    },

    thumbnail: {
      type: String, //cloudinary url
      required: true,
      unique: true,
    },

    genre: {
      type: Array,
      required: true,
    },

    releaseDate: {
      type: Date,
      required: true,
    },

    director: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Director',
    },

    cast: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Actor',
      },
    ],
    awards: {
      type: Array,
    },

    averageRating: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

const Movie = mongoose.model('Movie', MovieSchema);

export default Movie;
