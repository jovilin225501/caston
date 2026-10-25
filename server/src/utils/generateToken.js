import jwt from 'jsonwebtoken';

export const generateToken = (id, role = 'student') => {
  const secret = process.env.JWT_SECRET || 'campusconnect_default_dev_secret_key_123456';
  const expiresIn = process.env.JWT_EXPIRE || '7d';

  return jwt.sign({ id, role }, secret, {
    expiresIn,
  });
};
