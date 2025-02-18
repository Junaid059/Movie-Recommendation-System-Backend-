import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
const UserSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    lastName: {
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
  if (!this.isModified(password)) {
    return next();
  }
  this.password = bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isCorrect = async function () {
  const password = await bcrypt.compare(password, this.password);
  return password;
};

UserSchema.methods.generateAccessToken = function () {
  jwt.sign(
    { id: this._id, firstname: this.firstName, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

UserSchema.methods.generateRefreshToken = function () {
  jwt.sign({ id: _id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};

const User = mongoose.model('User', UserSchema);

export default User;
