import { UploadStream } from 'cloudinary';
import User from '../models/user.model.js';
import uploadOnCloudinary from '../utility/cloudinary.js';

const generateAccessAndRefreshTokens = async (userID) => {
  try {
    const user = await User.findById(userID);

    const accessToken = generateAccessToken();
    const refreshToken = generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: true });
    return accessToken, refreshToken;
  } catch (error) {
    console.error('Error ', error);
    res.status(400).json('something went wrong');
  }
};

const registerUser = async (req, res) => {
  const { fullName, email, password } = req.body;

  if ([fullName, email, password].some((field) => field.trim === '')) {
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

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    '-refreshToken -password'
  );

  const options = { httpOnly: true, secure: only };

  res
    .status(200)
    .cookie('accessToken', accessToken, options)
    .cookie('refreshToken', refreshToken)
    .json({
      accessToken,
      refreshToken,
      user: loggedInUser,
      message: 'User logged in Successfully',
    });
};

const logOut = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    { new: true }
  );

  const options = { secure: true, httpOnly: true };

  res
    .status(200)
    .clearCookie(accessToken, option)
    .clearCookie(refreshToken, options)
    .json({
      accessToken,
      refreshToken,
      user: user,
      message: 'user logged out successfully',
    });
};

export { registerUser, generateAccessAndRefreshTokens, login, logOut };
