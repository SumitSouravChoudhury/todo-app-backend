const crypto = require('crypto');

const User = require('../models/user');
const { createToken } = require('../services/auth');

const hashPassword = (password, salt) =>
  crypto.createHmac('sha256', salt).update(password).digest('hex');

const handleUserSignup = async (req, res, next) => {
  const { fullName, email, password } = req.body;

  if (!fullName) return res.status(400).json({ error: 'Full name is required' });
  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });

  const salt = crypto.randomBytes(16).toString('hex');

  try {
    await User.create({ fullName, email, salt, password: hashPassword(password, salt) });
    return res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    next(err);
  }
};

const handleUserSignin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });
  if (!password) return res.status(400).json({ error: 'Password is required' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const hashed = hashPassword(password, user.salt);
    if (hashed !== user.password)
      return res.status(401).json({ error: 'Invalid email or password' });

    const token = createToken(user);
    return res
      .status(200)
      .setHeader('Authorization', `Bearer ${token}`)
      .json({ message: 'Signed in successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleUserSignup, handleUserSignin };
