const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes/index');

const app = express();

const port = 3000;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Подключен к БД');
});

app.use((req, res, next) => {
  req.user = {
    _id: '64dc89507c21f858b16cf435',
  };

  next();
});

app.use(express.json());

app.use(router);

app.listen(port, () => {
  console.log(`Приложение запущено, порт: ${port}`);
});
