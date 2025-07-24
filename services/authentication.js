const JWT = require("jsonwebtoken");

function GenerateToken(user) {
  const payload = {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    profileImageURL: user.profileImageURL,
  };
  const token = JWT.sign(payload, process.env.SECRET_KEY);
  return token;
}

function ValidateToken(token) {
  const payload = JWT.verify(token, process.env.SECRET_KEY);
  return payload;
}

module.exports = { GenerateToken, ValidateToken };
