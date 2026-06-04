const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

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
    const user = await User.create({
      fullName,
      email,
      salt,
      password: hashPassword(password, salt),
    });

    if (req.file) {
      const safeName = fullName.replace(/\s+/g, '_');
      const ext = path.extname(req.file.originalname);
      const baseName = path.basename(req.file.originalname, ext).replace(/\s+/g, '_');
      const filename = `${user._id}-${safeName}-${baseName}${ext}`;
      const uploadDir = path.join(__dirname, '../uploads/profileImages');
      const uploadPath = path.join(uploadDir, filename);

      fs.mkdirSync(uploadDir, { recursive: true });
      fs.writeFileSync(uploadPath, req.file.buffer);
      await User.findByIdAndUpdate(user._id, {
        profileImgUrl: `/uploads/profileImages/${filename}`,
      });
    }

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
      .json({ message: 'Signed in successfully', userId: user._id });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleUserSignup, handleUserSignin };
