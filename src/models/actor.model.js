import mongoose from 'mongoose';

const actorSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

const Actor = mongoose.model('Actor', actorSchema);

export default Actor;
