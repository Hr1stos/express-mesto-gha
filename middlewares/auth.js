const jwt = require('jsonwebtoken');

const handleError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const { cookie } = req.headers;
  console.log(req.headers);
  if (!cookie || !cookie.startsWith('token=')) {
    return handleError(res);
  }

  const token = cookie.replace('token=', '');
  let payload;

  try {
    payload = jwt.verify(token, 'most-secret-key');
  } catch (err) {
    return handleError(res);
  }
  req.user = payload;
  return next();
};
