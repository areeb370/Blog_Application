const { ValidateToken } = require("../services/authentication");

function CheckAuthentication(req, res, next) {
  if (!req.cookies.token) {
    return next();
  }
  try {
    const user = ValidateToken(req.cookies.token);
    req.user = user;
  } catch (err) {}
  next();
}

module.exports = CheckAuthentication;
