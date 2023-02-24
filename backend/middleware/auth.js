const jwt = require('jsonwebtoken');
const { Unauthorised } = require('./errors/forbidden');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    return new Unauthorised('Authorization required');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(
      token,
      NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key',
    );
  } catch (err) {
    return new Unauthorised('Authorization verification failed');
  }
  req.user = payload;
  return next();
};
