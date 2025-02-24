import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const UserSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      unique: true,
      min: (6)['Password must include atleast 6 characters'],
      max: (100)['Password must not exceed 100 characters'],
      required: true,
    },

    ProfilePic: {
      type: String, // cloudinary url
      required: true,
    },

    role: {
      type: String,
      required: true,
      enum: ['user', 'admin'],
      default: 'user',
    },

    favouriteMovie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
    },

    favouriteActor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Actor',
    },

    customList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CustomList',
    },

    wishList: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'WishList',
    },

    notifications: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notification',
    },

    refreshToken: {
      type: String,
    },
  },
  { timestamp: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;
