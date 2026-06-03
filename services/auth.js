const jwt = require('jsonwebtoken');
const secret = process.env.SECRET_KEY;

const createToken = (user) => {
  const payload = { _id: user._id };

  const token = jwt.sign(payload, secret);

  return token;
};

const validateToken = (token) => {
  const payload = jwt.verify(token, secret);

  return payload;
};

module.exports = { createToken, validateToken };
