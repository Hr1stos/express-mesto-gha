const jwtToken = require('jsonwebtoken');

const { JWT_SECRET } = process.env;

const handleError = (res) => {
  res.status(401).send({ message: 'Необходима авторизация' });
};

module.exports = (req, res, next) => {
  const { jwt } = req.cookies;
  if (!jwt) {
    return handleError(res);
  }

  const token = jwt;
  let payload;

  try {
    payload = jwtToken.verify(token, JWT_SECRET);
  } catch (err) {
    return handleError(res);
  }
  req.user = payload;
  return next();
};
