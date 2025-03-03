import User from '../models/user.model.js';

const generateAccessToken = async (userID) => {
  return jwt.sign(
    { _id: userID, email: this.email },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

const registerAdmin = async (req, res) => {
  try {
    const { email, password, username, secret_Key } = req.body;

    if (!email || !password || !username || !secret_Key) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    if (secret_Key !== process.env.ADMIN_SECRET_KEY) {
      return res.status(400).json({
        message: 'Wrong secret key',
      });
    }

    const ExistingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (ExistingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newAdmin = new User({
      email,
      password,
      username,
      role: 'admin',
    });

    await User.save();

    if (!newAdmin) {
      return res.status(400).json({ message: 'Failed to create new admin' });
    }

    return res
      .status(200)
      .json({ user: newAdmin, message: 'New admin registered successfully' });
  } catch (error) {
    console.log('Error', error);
    return res.status(400).json({ message: "Couldn't register an admin" });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const PassCheck = await user.isCorrect(password);

    if (!PassCheck) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }

    const accessToken = generateAccessToken(user._id);

    const loggedinAdmin = await User.findById(user._id).select('-password');

    const options = { secure: true, httpOnly: true };

    return res.status(200).cookie('accessToken', accessToken, options).json({
      user: loggedinAdmin,
      accessToken,
      message: 'Admin logged in',
    });
  } catch (error) {
    console.log('Error', error);
    return res.status(400).json({ message: "Couldn't login an admin" });
  }
};

const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie('accessToken', { secure: true, httpOnly: true });
    return res.status(200).json({ message: 'Admin logged out successfully' });
  } catch (error) {
    console.log('Error', error);
    return res.status(401).json({ message: "Couldn't logout admin" });
  }
};

const UpdateAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const { userID } = useParams;

    const user = await User.findByIdAndUpdate(
      userID,
      {
        $set: {
          email: email,
          password: password,
        },
      },
      {
        new: true,
      }
    ).select('-password');

    return res
      .status(200)
      .json({ user, message: 'Aaccount Details Updated successfully' });
  } catch (error) {
    console.log('Error', error);
    return res.status(400).json('error updating admin details');
  }
};

const UpdateAdminPass = async (req, res) => {
  try {
    const { oldPass, NewPass } = req.body;

    if (!oldPass || !NewPass) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const { userID } = req.params;
    const user = await User.findById(userID);

    const checkPass = await user.isCorrect(oldPass);

    if (!checkPass) {
      return res.status(400).json({ message: 'Old password is incorrect' });
    }

    user.password = NewPass;

    await user.save();

    return res.status(200).json({ NewPass, message: 'Password updated' });
  } catch (error) {
    console.log('Error ', error);
    return res.status(500).json({ message: 'Error updating password' });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { userID } = req.params;

    if (!userID || userID.trim() === '') {
      return res
        .status(400)
        .json({ message: 'Please provide a valid user ID' });
    }

    return res
      .status(200)
      .json({ userID, message: 'user fetched successfully' });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Error fetching user' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (!users || users.trim() === '') {
      return res.status(400).json({ message: 'No users found' });
    }

    return res.status(200).json({ users, message: 'all users fetched' });
  } catch (error) {
    console.log('Error', error);
    return res.status(500).json({ message: 'Error fetching users' });
  }
};
export {
  registerAdmin,
  loginAdmin,
  generateAccessToken,
  logoutAdmin,
  UpdateAdmin,
  UpdateAdminPass,
  getSingleUser,
  getAllUsers,
};
