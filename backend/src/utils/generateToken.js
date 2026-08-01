import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  // Generate a short-lived access token
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  // Generate a long-lived refresh token
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });

  // Set the refresh token as an HTTP-only cookie
  res.cookie('jwt_refresh', refreshToken, {
    httpOnly: true,
    secure: true, // Must be true for sameSite: 'none'
    sameSite: 'none', // Allow cross-site cookies
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return accessToken;
};

export default generateToken;
