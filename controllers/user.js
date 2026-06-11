const path = require('path');

const User = require('../models/user');
const { uploadToCloudinary } = require('../utils/cloudinary');

const handleListAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}, { password: 0, salt: 0 });
    return res.status(200).json({ users });
  } catch (err) {
    next(err);
  }
};

const handleListUserById = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId, { password: 0, salt: 0 });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const handleUpdateUser = async (req, res, next) => {
  const userId = req.params.userId;
  const { fullName, email, role } = req.body;

  if (!fullName && !email && !req.file && !role)
    return res
      .status(400)
      .json({ error: 'At least one field (fullName, email, role, or profileImg) is required' });

  try {
    let profileImgUrl;

    if (req.file) {
      const nameForFile = fullName || (await User.findById(userId, { fullName: 1 }))?.fullName;
      if (!nameForFile) return res.status(404).json({ error: 'User not found' });

      const safeName = nameForFile.replace(/\s+/g, '_');
      const ext = path.extname(req.file.originalname);
      const baseName = path.basename(req.file.originalname, ext).replace(/\s+/g, '_');
      const publicId = `${userId}-${safeName}-${baseName}${ext}`;
      profileImgUrl = await uploadToCloudinary(req.file.buffer, 'profileImages', publicId);
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(fullName && { fullName }),
        ...(email && { email }),
        ...(role && { role }),
        ...(profileImgUrl && { profileImgUrl }),
      },
      { new: true, projection: { password: 0, salt: 0 } }
    );
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
};

const handleDeleteUser = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { handleListAllUsers, handleListUserById, handleUpdateUser, handleDeleteUser };
