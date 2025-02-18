import mongoose from 'mongoose';

const discussionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },

    message: {
      type: String,
    },

    replies: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },

        message: {
          type: String,
        },
      },
      { timestamps: true },
    ],
  },
  { timestamps: true }
);

const DiscussionForum = mongoose.model('DiscussionForum', discussionSchema);

export default DiscussionForum;
