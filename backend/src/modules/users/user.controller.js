import jwt from 'jsonwebtoken';
import User from './user.model.js';
import generateToken from '../../utils/generateToken.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      // Generate tokens and set cookie
      const accessToken = generateToken(res, user._id);

      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accessToken,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get user profile (validate access token)
// @route   GET /api/users/me
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Refresh access token
// @route   POST /api/users/refresh
// @access  Public (requires valid httpOnly cookie)
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.jwt_refresh;

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no refresh token' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
      
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      // Generate a new access token
      const accessToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '15m',
      });

      res.status(200).json({ accessToken });
    } catch (err) {
      res.status(401).json({ message: 'Not authorized, invalid refresh token' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
