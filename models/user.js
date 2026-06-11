const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImgUrl: {
      type: String,
      default: '/images/defaultProfileImage.svg',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        if (ret.profileImgUrl && !ret.profileImgUrl.startsWith('http')) {
          ret.profileImgUrl = `${process.env.BASE_URL}${ret.profileImgUrl}`;
        }
        return ret;
      },
    },
  }
);

const User = model('user', userSchema);

module.exports = User;
