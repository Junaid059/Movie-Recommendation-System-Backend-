import mongoose, { mongo } from 'mongoose';

const directorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    biography: {
      type: String,
    },

    filmography: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },

    awards: {
      type: Array,
    },
  },
  { timestamps: true }
);

const Director = mongoose.model('Director', directorSchema);

export default Director;
