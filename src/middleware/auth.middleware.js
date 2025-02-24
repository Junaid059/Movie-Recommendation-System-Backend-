import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.replace('Bearer ', '').trim();

    if (!token) {
      return res
        .status(401)
        .json({ message: 'invalid token or Token not found' });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken._id).select(
      '-password -accessToken'
    );

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'access denied, Admin only' });
    }
    req.user = user;

    next();
  } catch (error) {
    console.log('Error: ', error);
    return res.status(401).json('No valid token');
  }
};

export default adminAuth;
