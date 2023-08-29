const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../errors/unauthorizedError'); // 401

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('token=')) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  const token = cookie.replace('token=', '');
  let payload;

  try {
    payload = jwt.verify(token, 'most-secret-key');
  } catch (err) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};
