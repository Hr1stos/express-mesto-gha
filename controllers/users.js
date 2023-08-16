const userModel = require('../models/user');

const getUsers = (req, res) => {
  userModel.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  userModel.findById(req.params.id)
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  userModel.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ' Переданы некорректные данные пользователя' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserById = (req, res) => {
  const { name, about } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { name, about }, { runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: 'Переданы некорректные данные пользователя' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateAvatarById = (req, res) => {
  const { avatar } = req.body;
  userModel.findByIdAndUpdate(req.user._id, { avatar }, { runValidators: true })
    .then((user) => {
      if (user === null) {
        res.status(404).send({ message: 'Пользователь не найден' });
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({ message: ' Переданы некорректные данные пользователя' });
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserById,
  updateAvatarById,
};
