const jwt = require('jsonwebtoken')

const generateToken = (res, userData) => {
  const token = jwt.sign({ ...userData }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set JWT as an HTTP-Only Cookie
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: false,
    sameSite: "none",
  });

  return token;
};

module.exports = generateToken;