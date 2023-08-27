const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const router = require('./routes/index');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const handleError = require('./middlewares/handleError');
const {
  validateLogin,
  validateCreateUser,
} = require('./middlewares/requestValidation');

const app = express();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
}).then(() => {
  console.log('Подключен к БД');
});

app.use(helmet());
app.use(express.json());

app.post('/signup', validateCreateUser, createUser);
app.post('/signin', validateLogin, login);
app.use(cookieParser());
app.use(auth);
app.use(handleError);
app.use(router);

app.listen(PORT, () => {
  console.log(`Приложение запущено, порт: ${PORT}`);
});
