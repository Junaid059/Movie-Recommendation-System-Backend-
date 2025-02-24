import { UploadStream } from 'cloudinary';
import User from '../models/user.model.js';
import uploadOnCloudinary from '../utility/cloudinary.js';

const generateAccessTokens = async (userID) => {
  return jwt.sign(
    { _id: userID, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json('All fields are required');
  }

  const ExistedUser = await User.findOne({
    $or: [{ fullName }, { email }], // finding user using fullname or email
  });

  if (ExistedUser) {
    return res.status(400).json('User already exists');
  }

  const ProfilePicUrl = req.files?.ProfilePic?.[0].path;

  if (!ProfilePicUrl) {
    return res.status(400).json('Please upload a profile picture');
  }

  const ProfilePic = await uploadOnCloudinary(ProfilePicUrl);

  if (!ProfilePic) {
    return res.status(400).json('Failed to upload profile picture');
  }

  const NewUser = await User.create({
    fullName,
    email,
    password,
    ProfilePic: ProfilePic.secure_url,
  });

  if (!NewUser) {
    return res.status(400).json('Failed to create user');
  }

  return res.status(200).json(NewUser, 'New user created successfully');
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json('Email and password are required');
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json('User not found');
  }

  const Pass = await user.isCorrect(password);

  if (!Pass) {
    return res.status(400).json('Incorrect password');
  }

  const accessToken = await generateAccessTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(' -password');

  const options = { httpOnly: true, secure: only };

  res.status(200).cookie('accessToken', accessToken, options).json({
    accessToken,
    refreshToken,
    user: loggedInUser,
    message: 'User logged in Successfully',
  });
};

const logOut = async (req, res) => {
  try {
    res.clearCookie('accessToken', { secure: true, httpOnly: true });
    res.status(200).json('User logout successfully');
  } catch (error) {
    console.log('Error ', error);
    res.status(500).json('Error logging out');
  }
};

export { registerUser, generateAccessTokens, login, logOut };
