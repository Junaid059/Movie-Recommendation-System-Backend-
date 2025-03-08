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

const updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json('Name, email and password are required');
    }

    const { userID } = req.params;

    const user = await User.findByIdAndUpdate(
      userID,
      {
        $set: {
          name,
          email,
          password: await bcrypt.hash(password, 10),
        },
      },
      {
        new: true,
      }
    ).select('-password');

    return res.status(200).json({ user, message: 'user updated successfully' });
  } catch (error) {
    console.log('Error ', error);
    res.status(500).json('Error updating user');
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID || !userID.trim()) {
      return res.status(400).json('User ID is required');
    }

    const user = await User.findByIdAndDelete(userID);
    if (!user) {
      return res.status(404).json('User not found');
    }

    return res.status(200).json({ user, message: 'user deleted successfully' });
  } catch (error) {
    console.log('Error ', error);
    res.status(500).json('Error deleting user');
  }
};

const changePass = async (req, res) => {
  try {
    const { oldPass, newPass } = req.body;
    if (!oldPass || !newPass) {
      return res.status(400).json('Old password and new password are required');
    }

    const { userID } = req.params;
    if (!userID || !userID.trim()) {
      return res.status(400).json('User ID is required');
    }

    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json('User not found');
    }

    const changePass = await user.isCorrect(oldPass);
    if (!changePass) {
      return res.status(400).json('Old password is incorrect');
    }

    user.password = newPass;
    await user.save();

    return res
      .status(200)
      .json({ user, message: 'password changed successfully' });
  } catch (error) {
    console.log('Error ', error);
    res.status(500).json('Error changing password');
  }
};

const updateProfilePic = async (req, res) => {
  try {
    const ProfilePic = req.file.path;

    if (!ProfilePic) {
      return res.status(400).json('Profile picture is required');
    }

    const Pic = await uploadOnCloudinary(ProfilePic);

    if (!Pic.url) {
      return res.status(500).json('Error uploading profile picture');
    }

    const UpdatedPic = await User.findByIdAndUpdate(
      req.user._id,
      {
        $set: { profilepic: Pic.url },
      },
      {
        new: true,
      }
    );

    return res
      .status(200)
      .json({ UpdatedPic, message: 'Profile Pic updated successfully' });
  } catch (error) {
    console.log('Error ', error);
    res.status(500).json('Error updating profile picture');
  }
};
export {
  registerUser,
  generateAccessTokens,
  login,
  logOut,
  updateUser,
  deleteUser,
  changePass,
  updateProfilePic,
};
