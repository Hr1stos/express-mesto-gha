const jwt = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const handleError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  if (!cookie || !cookie.startsWith('token=')) {
    return handleError(res);
  }

  const token = cookie.replace('token=', '');
  let payload;

  try {
    console.log(JWT_SECRET);
    payload = jwt.verify(token, 'most-secret-key');
  } catch (err) {
    return handleError(res);
  }
  req.user = payload;
  return next();
};
