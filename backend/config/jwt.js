import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const EXPIRES_IN = '7d'; 


export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: EXPIRES_IN }
  );
};


export const verifyToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};
